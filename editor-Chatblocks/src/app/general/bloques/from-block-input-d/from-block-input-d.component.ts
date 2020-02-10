import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfazViewBlkInputDin, InterfazVariables } from '../interfaces/interfaz-view-blk-info';
import { Globals } from '../interfaces/Globals';
import { LinksAPIService } from 'src/app/sendToDB/linksAPI.service';
import { CredencialAPIService } from 'src/app/sendToDB/credenciales.service';
import { BlkInputServiceDin } from 'src/app/sendToDB/blkIputDin.service';
import { variablesService } from 'src/app/sendToDB/variables.service';

@Component({
  selector: 'app-from-block-input-d',
  templateUrl: './from-block-input-d.component.html',
  styleUrls: ['./from-block-input-d.component.css']
})
export class FromBlockInputDComponent implements OnInit {

  

  fromBlksInput: FormGroup;
  createMode: boolean=true;
  bloque: InterfazViewBlkInputDin;
  states: string[]=[];
  tamLinks: number=0;
  tamCredenciales: number=0;
  edit_opcNX: string;
  edit_NX: string;
  edit_nom_estado: string;
  list_cad: string[];
  list_num: string[];

  constructor(private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal, 
    private blkInputDinService: BlkInputServiceDin,
    private linksAPIService: LinksAPIService,
    private credencialAPIService: CredencialAPIService,
    public globals: Globals,
    private varService: variablesService
    ) { }

    ngOnInit() {
      for(let i=0;i<this.globals.AllBlocks.length;i++){
        for(let j=0;j<this.globals.AllBlocks[i].length;j++){
          this.states.push(this.globals.AllBlocks[i][j].namestate);
        }
      }
  
      this.fromBlksInput=this.formBuilder.group({

        namestate: ['', Validators.required],
        contenido: ['', Validators.required],
        opc_nextid: ['',Validators.required],
        next_id: [''],
        typingtime: ['', Validators.required],
        validacion: ['', Validators.required],
        default_id: ['', Validators.required],
        link1: ['', Validators.required],
        link2: [''],
        nomCredencial1: [''],
        credencial1: [''],
        nomCredencial2: [''],
        credencial2: [''],
        nomCredencial3: [''],
        credencial3: [''],
        new_exist: ['', Validators.required],
        opc_data: ['', Validators.required],
        save_var: ['', Validators.required],
        tag_active: [false]
      });

      this.cargar_var();
  
      if (!this.createMode) {
        this.loadBloque(this.bloque); 
      }
    }

    cargar_var(){
      this.list_cad=[];
      this.list_num=[];
        for(let cont_vars=0; cont_vars<this.globals.tabla_vars.length; cont_vars++){
          if(this.globals.tabla_vars[cont_vars].opc_data == 'Cadena' && this.globals.tabla_vars[cont_vars].opc_type == 'Variable'){
            this.list_cad.push(this.globals.tabla_vars[cont_vars].var);}
          else if(this.globals.tabla_vars[cont_vars].opc_data == 'Numero' && this.globals.tabla_vars[cont_vars].opc_type == 'Variable'){
            this.list_num.push(this.globals.tabla_vars[cont_vars].var);}
        }
    }
  
  loadBloque(bloque){
    let opc_data_: string;
    let save_var_: string;
    for(let cont_var=0; cont_var<this.globals.tabla_vars.length; cont_var++){
      if(this.globals.tabla_vars[cont_var].id_var == bloque.id_var){
        opc_data_ = this.globals.tabla_vars[cont_var].opc_data;
        save_var_ = this.globals.tabla_vars[cont_var].var;
      }
    }

    console.log("Opc NX Edit-> "+ bloque.opc_nextID);
    this.fromBlksInput.patchValue(bloque);
    this.edit_opcNX=bloque.opc_nextid;
    this.edit_NX=bloque.next_id;
    this.edit_nom_estado=bloque.namestate;
      

    let links: any[]=[];
    let nomC: any[]=[];
    let credenciales: any[]=[];

    links[0]='';
    links[1]='';
    
    links[0]=bloque.linksAPI[0].links;
    this.tamLinks++;
    if(bloque.linksAPI.length == 2){
      links[1]=bloque.linksAPI[1].links;
      this.tamLinks++;
    }
      
    
    nomC[0]='';
    credenciales[0]='';
    nomC[1]='';
    credenciales[1]='';
    nomC[2]='';
    credenciales[2]='';

    for(let i=0;i<bloque.credenciales.length;i++){
      nomC[i]=bloque.credenciales[i].namecredencial;
      credenciales[i]=bloque.credenciales[i].credencial;
      this.tamCredenciales++;
    }
    
    let bloque2={
      namestate: bloque.namestate,
      contenido: bloque.contenido,
      opc_nextid: bloque.opc_nextid,
      next_id: bloque.next_id,
      typingtime: bloque.typingtime,
      validacion: bloque.validacion,
      default_id: bloque.default_id,
      link1: links[0],
      link2: links[1],
      nomCredencial1: nomC[0],
      credencial1: credenciales[0],
      nomCredencial2: nomC[1],
      credencial2: credenciales[1],
      nomCredencial3: nomC[2],
      credencial3: credenciales[2],
      new_exist: 'existente',
      opc_data: opc_data_,
      save_var: save_var_,
      tag_active: bloque.tag_active
    }
    this.fromBlksInput.patchValue(bloque2);    
  }
    
  
  saveBlockInputDin() {
      if (this.fromBlksInput.invalid) {
        console.log('INVALIDO')
        return;
      }
      
      if (this.createMode){
        console.log('CREAR')
        let datosBloque: InterfazViewBlkInputDin = this.fromBlksInput.value;
        let credenciales: any[]=[];
        let links: any[]=[];

        datosBloque.id_block = '12';
        datosBloque.id_robot=this.globals.RobotSelect.id_robot;
        datosBloque.blocktype='inputDinamico';
        datosBloque.contenttype='text';
        datosBloque.pos_x=0;
        datosBloque.pos_y=this.globals.AllBlocks.length-1;

        let link1={
          id_link: '13',
          blocktype:  'inputDinamico',
          links:  this.fromBlksInput.value.link1,
          id_block: '1'
        }
        links.push(link1);

        if(this.fromBlksInput.value.link2 != ''){
          let link2={
            id_link: '13',
            blocktype:  'inputDinamico',
            links:  this.fromBlksInput.value.link2,
            id_block: '1'
          }
          links.push(link2);
        }
        datosBloque.linksAPI=links;

        if(this.fromBlksInput.value.nomCredencial2 != ''){
          let credencial1={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'inputDinamico',
            namecredencial: this.fromBlksInput.value.nomCredencial1,
            credencial: this.fromBlksInput.value.credencial1
          }
        credenciales.push(credencial1);
        }

        if(this.fromBlksInput.value.nomCredencial2 != ''){
          let credencial2={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'inputDinamico',
            namecredencial: this.fromBlksInput.value.nomCredencial2,
            credencial: this.fromBlksInput.value.credencial2
          }
          credenciales.push(credencial2);
        }
        if(this.fromBlksInput.value.nomCredencial3 != ''){
          let credencial3={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'inputDinamico',
            namecredencial: this.fromBlksInput.value.nomCredencial3,
            credencial: this.fromBlksInput.value.credencial3
          }
          credenciales.push(credencial3);
        }
        datosBloque.credenciales=credenciales;

        console.log("Opc NX-> "+ datosBloque.opc_nextid);
        console.log("NX-> "+ datosBloque.next_id);
        //this.control_variables(datosBloque);
        this.control_variables(datosBloque, credenciales);
  
        
      } else{
        //EDITAR
        let datosBloque: InterfazViewBlkInputDin = this.fromBlksInput.value;
        let credenciales: any[]=[];
        let links: any[]=[];

        datosBloque.id_block = this.bloque.id_block;
        datosBloque.id_robot=this.bloque.id_robot;
        datosBloque.blocktype='inputDinamico';
        datosBloque.contenttype='text';
        datosBloque.pos_x=this.bloque.pos_x;
        datosBloque.pos_y=this.bloque.pos_y;
        datosBloque.tags_entradas=this.bloque.tags_entradas;

        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO 1');
        let link1={
          id_link: this.bloque.linksAPI[0].id_link,
          blocktype:  'inputDinamico',
          links:  this.fromBlksInput.value.link1,
          id_block: this.bloque.id_block
        }
        links.push(link1);
        this.linksAPIService.updateLinksAPI(link1).subscribe(response=>{});
        datosBloque.linksAPI=links;
        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO 2');
        if(this.fromBlksInput.value.link2 != ''){

          if(this.tamLinks < 2){
            let link2={
              id_link: '13',
              blocktype:  'inputDinamico',
              links:  this.fromBlksInput.value.link2,
              id_block: this.bloque.id_block
            }

            this.linksAPIService.addDatosLinksAPI(link2).subscribe(response =>{
              const datos='{"id_block": "'+this.bloque.id_block+'", "links": "'+link2.links+'"}';
              this.linksAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseC=> {
                for(let i=0;i<responseC.length;i++)
                  if(responseC[i].links == link2.links && responseC[i].blocktype=='inputDinamico')
                    link2.id_link=responseC[i].id_link;
                
                links.push(link2);
                datosBloque.linksAPI=links;
              });
            });

            
          }
          else{
            let link2={
              id_link: this.bloque.linksAPI[1].id_link,
              blocktype: 'inputDinamico',
              links:  this.fromBlksInput.value.link2,
              id_block: this.bloque.id_block
            }
            this.linksAPIService.updateLinksAPI(link2).subscribe(response=>{});
            links.push(link2);
            datosBloque.linksAPI=links;
          }

        }
        else if(this.tamLinks == 2){
          this.linksAPIService.deleteLinksAPI(this.bloque.linksAPI[1].id_link).subscribe(response=>{});
        }

        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO3');
        

        if(this.fromBlksInput.value.nomCredencial1 != ''){
          if(this.tamCredenciales > 0){
            let credencial1={
              id_credencial: this.bloque.credenciales[0].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'inputDinamico',
              namecredencial: this.fromBlksInput.value.nomCredencial1,
              credencial: this.fromBlksInput.value.credencial1
            }
            this.credencialAPIService.updateCredencialAPI(credencial1).subscribe(response=>{});
            credenciales.push(credencial1);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial1={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'inputDinamico',
              namecredencial: this.fromBlksInput.value.nomCredencial1,
              credencial: this.fromBlksInput.value.credencial1
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial1).subscribe(response =>{
              //const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial1.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial1.credencial && responseF[i].blocktype=='inputDinamico')
                    credencial1.id_credencial=responseF[i].id_credencial;

                
                credenciales.push(credencial1);
                datosBloque.credenciales=credenciales;
                //this.guardarDatos(datosBloque);                                
              });
            });
            
          } 
        }
        else if(this.tamCredenciales > 0){
          this.credencialAPIService.deleteCredencialAPI(this.bloque.credenciales[0].id_credencial).subscribe(response=>{});
        }

        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO 4');




        if(this.fromBlksInput.value.nomCredencial2 != ''){
          if(this.tamCredenciales > 1){
            let credencial2={
              id_credencial: this.bloque.credenciales[1].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'inputDinamico',
              namecredencial: this.fromBlksInput.value.nomCredencial2,
              credencial: this.fromBlksInput.value.credencial2
            }
            this.credencialAPIService.updateCredencialAPI(credencial2).subscribe(response=>{});
            credenciales.push(credencial2);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial2={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'inputDinamico',
              namecredencial: this.fromBlksInput.value.nomCredencial2,
              credencial: this.fromBlksInput.value.credencial2
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial2).subscribe(response =>{
              const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial2.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial2.credencial && responseF[i].blocktype=='inputDinamico')
                    credencial2.id_credencial=responseF[i].id_credencial;

                
                credenciales.push(credencial2);
                datosBloque.credenciales=credenciales;
                //this.guardarDatos(datosBloque);                                
              });
            });
            
          }
        }
        else if(this.tamCredenciales > 1){
          this.credencialAPIService.deleteCredencialAPI(this.bloque.credenciales[1].id_credencial).subscribe(response=>{});
        }

        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO 5');



        if(this.fromBlksInput.value.nomCredencial3 != ''){
          if(this.tamCredenciales == 3){
            let credencial3={
              id_credencial: this.bloque.credenciales[2].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'inputDinamico',
              namecredencial: this.fromBlksInput.value.nomCredencial3,
              credencial: this.fromBlksInput.value.nomCredencial3
            }
            this.credencialAPIService.updateCredencialAPI(credencial3).subscribe(response=>{});
            credenciales.push(credencial3);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial3={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'inputDinamico',
              namecredencial: this.fromBlksInput.value.nomCredencial3,
              credencial: this.fromBlksInput.value.nomCredencial3
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial3).subscribe(response =>{
              //const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial3.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial3.credencial && responseF[i].blocktype=='inputDinamico')
                    credencial3.id_credencial=responseF[i].id_credencial;


                credenciales.push(credencial3);
                datosBloque.credenciales=credenciales;
                //this.guardarDatos(datosBloque);                                
              });
            });
            
            
            
          }
        }
        else if(this.tamCredenciales == 3){
          this.credencialAPIService.deleteCredencialAPI(this.bloque.credenciales[2].id_credencial).subscribe(response=>{});
        }

        this.control_variables(datosBloque, credenciales);
      }
    }

    





    control_variables(datosBloque: any, credenciales){
      let busqueda_var = this.existencia_variables();
      if(busqueda_var == 'no se encontro'){
        let var_: InterfazVariables={
          id_var: 'sin asignar',
          id_robot: this.globals.RobotSelect.id_robot,
          opc_type: 'Variable',
          opc_data: this.fromBlksInput.value.opc_data,
          var: this.fromBlksInput.value.save_var
        }
        this.varService.addDatosVar(var_).subscribe(response=> {
          const datos='{"id_robot": "'+this.globals.RobotSelect.id_robot+'", "var": "'+var_.var+'", "opc_data": "'+var_.opc_data+'"}';
            this.varService.getVar_data(datos).subscribe(responseVar=> {
              console.log('datos var-> '+responseVar.id_var);
              console.log('datos var2-> '+responseVar[0].id_var);
              var_.id_var = responseVar[0].id_var;
              datosBloque.id_var = responseVar[0].id_var;
              this.globals.tabla_vars.push(var_);
              if (this.createMode)
                this.guardar_bloque(datosBloque, credenciales);
              else
                this.editar_bloque(datosBloque);  
            });
        });      
      }
      else{
        datosBloque.id_var = busqueda_var;
        if (this.createMode)
          this.guardar_bloque(datosBloque, credenciales);
        else
          this.editar_bloque(datosBloque);
      }
    }
  
    existencia_variables(){
      let id_var: any= 'no se encontro';
      for(let cont_var=0; cont_var<this.globals.tabla_vars.length; cont_var++)
        if(this.globals.tabla_vars[cont_var].var == this.fromBlksInput.value.save_var && this.globals.tabla_vars[cont_var].opc_data == this.fromBlksInput.value.opc_data){
          id_var = this.globals.tabla_vars[cont_var].id_var;
        }
      return id_var;
    }
  
    guardar_bloque(datosBloque: InterfazViewBlkInputDin, credenciales: any){
      this.blkInputDinService.addDatosBlkInput(datosBloque).subscribe(response =>{
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        this.blkInputDinService.getBlk(datos).subscribe(responseA=> {
          datosBloque.id_block=responseA[0].id_block;
          datosBloque.linksAPI[0].id_block=datosBloque.id_block;

          
          this.linksAPIService.addDatosLinksAPI(datosBloque.linksAPI[0]).subscribe(response =>{
            //const datos='{"id_block": "'+datosBloque.id_block+'", "links": "'+datosBloque.linksAPI[0].links+'"}';
            //console.log('Consulta: id_block-> '+datosBloque.id_block+', links-> '+datosBloque.linksAPI[0].links);
            //console.log('consulta-> '+datos);
            this.linksAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseB=> {                
              for(let i=0;i<responseB.length;i++)
                if(responseB[i].links == datosBloque.linksAPI[0].links && responseB[i].blocktype=='inputDinamico')
                  datosBloque.linksAPI[0].id_link=responseB[i].id_link;
              if(datosBloque.linksAPI.length==1 && credenciales.length==0){
                this.guardarDatos(datosBloque);
              }
              else{

              if(datosBloque.linksAPI.length==2){
                datosBloque.linksAPI[1].id_block=datosBloque.id_block;
                this.linksAPIService.addDatosLinksAPI(datosBloque.linksAPI[1]).subscribe(response =>{
                  //const datos='{"id_block": "'+datosBloque.id_block+'", "links": "'+datosBloque.linksAPI[1].links+'"}';
                  this.linksAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseC=> {
                    for(let i=0;i<responseC.length;i++)
                      if(responseC[i].links == datosBloque.linksAPI[1].links && responseC[i].blocktype=='inputDinamico')
                        datosBloque.linksAPI[1].id_link=responseC[i].id_link;

                  });
                });
              }
              if(credenciales.length > 0){
              datosBloque.credenciales[0].id_block=datosBloque.id_block;
              this.credencialAPIService.addDatosCredencialAPI(datosBloque.credenciales[0]).subscribe(response =>{
                //const datos='{"id_block": "'+datosBloque.id_block+'", "credencial": "'+datosBloque.credenciales[0].credencial+'"}';
                this.credencialAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseD=> {
                  for(let i=0;i<responseD.length;i++)
                      if(responseD[i].credencial == datosBloque.credenciales[0].credencial && responseD[i].blocktype=='inputDinamico')
                        datosBloque.credenciales[0].id_credencial=responseD[i].id_credencial;
                  
                  

                  if(credenciales.length>1){
                    datosBloque.credenciales[1].id_block=datosBloque.id_block;
                    this.credencialAPIService.addDatosCredencialAPI(datosBloque.credenciales[1]).subscribe(response =>{
                      //const datos='{"id_block": "'+datosBloque.id_block+'", "credencial": "'+datosBloque.credenciales[1].credencial+'"}';
                      this.credencialAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseE=> {
                        for(let i=0;i<responseE.length;i++)
                          if(responseE[i].credencial == datosBloque.credenciales[1].credencial && responseE[i].blocktype=='inputDinamico')
                            datosBloque.credenciales[1].id_credencial=responseE[i].id_credencial;
                       
                        

                        if(credenciales.length==3){
                          datosBloque.credenciales[2].id_block=datosBloque.id_block;
                          this.credencialAPIService.addDatosCredencialAPI(datosBloque.credenciales[2]).subscribe(response =>{
                            //const datos='{"id_block": "'+datosBloque.id_block+'", "credencial": "'+datosBloque.credenciales[2].credencial+'"}';
                            this.credencialAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseF=> {
                              for(let i=0;i<responseF.length;i++)
                                if(responseF[i].credencial == datosBloque.credenciales[2].credencial && responseF[i].blocktype=='inputDinamico')
                                  datosBloque.credenciales[2].id_credencial=responseF[i].id_credencial;

                              
                              this.guardarDatos(datosBloque);                                
                            });
                          });
    
                        }
                        else
                          this.guardarDatos(datosBloque);

                      });
                    });

                  }
                  else
                    this.guardarDatos(datosBloque);

                });
              });
            }
          }
            });
          });

          
        });
      });
    }
  
    editar_bloque(datosBloque: InterfazViewBlkInputDin){
      console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO6');
        this.blkInputDinService.updateBlkInput(datosBloque).subscribe(response=>{
          for(let i=0;i<this.globals.AllBlocks.length;i++){
            for(let j=0;j<this.globals.AllBlocks[i].length;j++){
              if(this.globals.AllBlocks[i][j].id_block == datosBloque.id_block && this.globals.AllBlocks[i][j].blocktype == datosBloque.blocktype){
                this.globals.AllBlocks[i][j]=datosBloque;
                this.globals.AllBlocks[i][j].tags_entradas=datosBloque.tags_entradas;
              }
            }
          }
          for(let i=0;i<this.globals.AllBlocks.length;i++){
            for(let j=0;j<this.globals.AllBlocks[i].length;j++){
              console.log(i+","+j+" -> "+this.globals.AllBlocks[i][j].namestate);
            }
          }
          this.editar_tag(datosBloque.opc_nextid, datosBloque.next_id,datosBloque.namestate);
        });
        this.handleSuccessfulEditTodo(datosBloque);
    }









    guardarDatos(datosBloque: any){
      datosBloque.tags_entradas=[]; 
      this.globals.AllBlocks.pop();
      this.globals.AllBlocks.push([datosBloque]);
      this.globals.AllBlocks[this.globals.AllBlocks.length-1][0].opc_nextid=datosBloque.opc_nextid;
      this.globals.AllBlocks.push([]);
      let result= this.globals.generar_Id();
      this.crear_tag(datosBloque.opc_nextid, datosBloque.next_id,datosBloque.namestate);
      this.handleSuccessfulSaveTodo(datosBloque);
    }

    crear_tag(opc_sigEstado: string, sigEstado: string, estado_actual: string){
      if(opc_sigEstado=="Seleccionar de la lista"){
        for(let i=0;i<this.globals.AllBlocks.length;i++){
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){
            if(this.globals.AllBlocks[i][j].namestate == sigEstado){
              this.globals.AllBlocks[i][j].tags_entradas.push(estado_actual);
            }
          }
        }
      }    
    }
  
    editar_tag(opc_sigEstado: string, sigEstado: string, estado_actual: string){
      console.log("estado:"+sigEstado);
      console.log("tags:");
  
      if(opc_sigEstado=="Seleccionar de la lista" && this.edit_opcNX=="Generar automaticamente"){
        this.crear_tag(opc_sigEstado, sigEstado, estado_actual); 
      }
      else if(opc_sigEstado=="Generar automaticamente" && this.edit_opcNX=="Seleccionar de la lista"){
        for(let i=0;i<this.globals.AllBlocks.length;i++)
          for(let j=0;j<this.globals.AllBlocks[i].length;j++)
            if(this.globals.AllBlocks[i][j].namestate == this.edit_NX){
              if(this.edit_nom_estado == estado_actual)
                this.eliminar_tag(estado_actual, i, j);
              else
                this.eliminar_tag(this.edit_nom_estado, i, j);
            }    
      }
      else if(opc_sigEstado=="Seleccionar de la lista" && this.edit_opcNX=="Seleccionar de la lista"){
        for(let i=0;i<this.globals.AllBlocks.length;i++)
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){
            if(this.globals.AllBlocks[i][j].namestate == this.edit_NX){
              if(this.edit_nom_estado == estado_actual)
                this.eliminar_tag(estado_actual, i, j);
              else
                this.eliminar_tag(this.edit_nom_estado, i, j); 
            }
            if(this.globals.AllBlocks[i][j].namestate == sigEstado)
              this.globals.AllBlocks[i][j].tags_entradas.push(estado_actual);
          }
      }
      
      let arr_sigEstado;
      if(this.edit_nom_estado != estado_actual){
        for(let i=0;i<this.globals.AllBlocks.length;i++)
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){
            arr_sigEstado = this.globals.AllBlocks[i][j].next_id.split(",");
            for(let x=0;x<arr_sigEstado.length;x++)
              if(arr_sigEstado[x]==this.edit_nom_estado){
                if(arr_sigEstado.length>1)
                  this.editar_nom(i, j, x, estado_actual, arr_sigEstado);
                else
                  this.globals.AllBlocks[i][j].next_id=estado_actual;                
              }          
          }
      }
  
    }
  
    editar_nom(i, j, pos_nx, estado_actual, arr_sigEstado){
      arr_sigEstado[pos_nx]=estado_actual;
      let next_id='';
      let x=0;
      for(x=0;x<(arr_sigEstado.length-1);x++){
        next_id=next_id+arr_sigEstado[x]+',';
      }
      next_id=next_id+arr_sigEstado[x+1];
      this.globals.AllBlocks[i][j].next_id=next_id;
    }
  
    eliminar_tag(nom_estado, i, j){
      for(let y=0;y<this.globals.AllBlocks[i][j].tags_entradas.length;y++){
        console.log("- "+this.globals.AllBlocks[i][j].tags_entradas[y]);
        if(this.globals.AllBlocks[i][j].tags_entradas[y]==nom_estado)
          this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
      }
    }
  
  
    handleSuccessfulSaveTodo(datos: InterfazViewBlkInputDin) {
      this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
    }
  
    handleSuccessfulEditTodo(datos: InterfazViewBlkInputDin) {
      this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
    }
  
  
  }
  

