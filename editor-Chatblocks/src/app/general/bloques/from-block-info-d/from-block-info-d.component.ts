import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfazViewBlkInfoDin } from '../interfaces/interfaz-view-blk-info';
import { Globals } from '../interfaces/Globals';
import { BlkInfoServiceDin } from 'src/app/sendToDB/blkInfoDin.service';
import { LinksAPIService } from 'src/app/sendToDB/linksAPI.service';
import { CredencialAPIService } from 'src/app/sendToDB/credenciales.service';

@Component({
  selector: 'app-from-block-info-d',
  templateUrl: './from-block-info-d.component.html',
  styleUrls: ['./from-block-info-d.component.css']
})
export class FromBlockInfoDComponent implements OnInit {

  fromBlksInfo: FormGroup;
  createMode: boolean=true;
  bloque: InterfazViewBlkInfoDin;
  states: string[]=[];
  tamLinks: number=0;
  tamCredenciales: number=0;  
  edit_opcNX: string;
  edit_NX: string;
  edit_nom_estado: string;

  constructor(private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal, 
    private blkInfoDinService: BlkInfoServiceDin,
    private linksAPIService: LinksAPIService,
    private credencialAPIService: CredencialAPIService,
    public globals: Globals
    ) { }

    ngOnInit() {
      for(let i=0;i<this.globals.AllBlocks.length;i++){
        for(let j=0;j<this.globals.AllBlocks[i].length;j++){
          this.states.push(this.globals.AllBlocks[i][j].namestate);
        }
      }
  
      this.fromBlksInfo=this.formBuilder.group({

        namestate: ['', Validators.required],
        contenido: ['', Validators.required],
        opc_nextid: ['',Validators.required],
        next_id: [''],
        typingtime: ['', Validators.required],
        link1: ['', Validators.required],
        link2: [''],
        nomCredencial1: [''],
        credencial1: [''],
        nomCredencial2: [''],
        credencial2: [''],
        nomCredencial3: [''],
        credencial3: [''],
        tag_active: [false]
      });
  
      if (!this.createMode) {
        this.loadBloque(this.bloque); 
      }
    }
  
  loadBloque(bloque){
    console.log("Opc NX Edit-> "+ bloque.opc_nextID);
    this.fromBlksInfo.patchValue(bloque);
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
      link1: links[0],
      link2: links[1],
      nomCredencial1: nomC[0],
      credencial1: credenciales[0],
      nomCredencial2: nomC[1],
      credencial2: credenciales[1],
      nomCredencial3: nomC[2],
      credencial3: credenciales[2],
      tag_active: bloque.tag_active
    }
    this.fromBlksInfo.patchValue(bloque2);    
  }
    
  
  saveBlockInfo() {
      if (this.fromBlksInfo.invalid) {
        console.log('INVALIDO')
        return;
      }
      
      if (this.createMode){
        console.log('CREANDO BLOQUE INFODIN');
        let datosBloque: InterfazViewBlkInfoDin = this.fromBlksInfo.value;
        let credenciales: any[]=[];
        let links: any[]=[];

        datosBloque.id_block = '12';
        datosBloque.id_robot=this.globals.RobotSelect.id_robot;
        datosBloque.blocktype='informativoDinamico';
        datosBloque.contenttype='text';
        datosBloque.pos_x=0;
        datosBloque.pos_y=this.globals.AllBlocks.length-1;

        let link1={
          id_link: '13',
          blocktype:  'informativoDinamico',
          links:  this.fromBlksInfo.value.link1,
          id_block: '1'
        }
        links.push(link1);

        if(this.fromBlksInfo.value.link2 != ''){
          let link2={
            id_link: '13',
            blocktype:  'informativoDinamico',
            links:  this.fromBlksInfo.value.link2,
            id_block: '1'
          }
          links.push(link2);
        }
        datosBloque.linksAPI=links;

        if(this.fromBlksInfo.value.nomCredencial1 != ''){
          let credencial1={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'informativoDinamico',
            namecredencial: this.fromBlksInfo.value.nomCredencial1,
            credencial: this.fromBlksInfo.value.credencial1
          }
        credenciales.push(credencial1);
        }

        if(this.fromBlksInfo.value.nomCredencial2 != ''){
          let credencial2={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'informativoDinamico',
            namecredencial: this.fromBlksInfo.value.nomCredencial2,
            credencial: this.fromBlksInfo.value.credencial2
          }
          credenciales.push(credencial2);
        }
        if(this.fromBlksInfo.value.nomCredencial3 != ''){
          let credencial3={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'informativoDinamico',
            namecredencial: this.fromBlksInfo.value.nomCredencial3,
            credencial: this.fromBlksInfo.value.credencial3
          }
          credenciales.push(credencial3);
        }
        datosBloque.credenciales=credenciales;

        console.log("Opc NX-> "+ datosBloque.opc_nextid);
        console.log("NX-> "+ datosBloque.next_id);
        console.log('GUARDANDO BLOQUE INFODIN');
        //todo.updateAt = new Date();
  
        this.blkInfoDinService.addDatosBlkInfo(datosBloque).subscribe(response =>{
          const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
          this.blkInfoDinService.getBlk(datos).subscribe(responseA=> {
            datosBloque.id_block=responseA[0].id_block;
            datosBloque.linksAPI[0].id_block=datosBloque.id_block;
            console.log('PASO 1');
            
            this.linksAPIService.addDatosLinksAPI(datosBloque.linksAPI[0]).subscribe(response =>{
              //const datos='{"id_block": "'+datosBloque.id_block+'", "links": "'+datosBloque.linksAPI[0].links+'"}';
              //console.log('Consulta: id_block-> '+datosBloque.id_block+', links-> '+datosBloque.linksAPI[0].links);
              //console.log('consulta-> '+datos);
              console.log('PASO 2');
              this.linksAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseB=> {
                console.log('PASO 3');                
                for(let i=0;i<responseB.length;i++)
                  if(responseB[i].links == datosBloque.linksAPI[0].links && responseB[i].blocktype=='informativoDinamico')
                    datosBloque.linksAPI[0].id_link=responseB[i].id_link;
                if(datosBloque.linksAPI.length==1 && credenciales.length==0){
                  this.guardarDatos(datosBloque);
                }
                else{
                  if(datosBloque.linksAPI.length==2){
                    datosBloque.linksAPI[1].id_block=datosBloque.id_block;
                    this.linksAPIService.addDatosLinksAPI(datosBloque.linksAPI[1]).subscribe(response =>{
                      console.log('PASO 4');
                      //const datos='{"id_block": "'+datosBloque.id_block+'", "links": "'+datosBloque.linksAPI[1].links+'"}';
                      this.linksAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseC=> {
                        console.log('PASO 5');
                        for(let i=0;i<responseC.length;i++)
                          if(responseC[i].links == datosBloque.linksAPI[1].links && responseC[i].blocktype=='informativoDinamico')
                            datosBloque.linksAPI[1].id_link=responseC[i].id_link;

                      });
                    });
                  }
                  if(credenciales.length > 0){
                  datosBloque.credenciales[0].id_block=datosBloque.id_block;
                  this.credencialAPIService.addDatosCredencialAPI(datosBloque.credenciales[0]).subscribe(response =>{
                    console.log('PASO 6');
                    //const datos='{"id_block": "'+datosBloque.id_block+'", "credencial": "'+datosBloque.credenciales[0].credencial+'"}';
                    this.credencialAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseD=> {
                    console.log('PASO 7');
                    for(let i=0;i<responseD.length;i++)
                        if(responseD[i].credencial == datosBloque.credenciales[0].credencial && responseD[i].blocktype=='informativoDinamico')
                          datosBloque.credenciales[0].id_credencial=responseD[i].id_credencial;
                    
                    

                    if(credenciales.length>1){
                      datosBloque.credenciales[1].id_block=datosBloque.id_block;
                      this.credencialAPIService.addDatosCredencialAPI(datosBloque.credenciales[1]).subscribe(response =>{
                        console.log('PASO 9');
                        //const datos='{"id_block": "'+datosBloque.id_block+'", "credencial": "'+datosBloque.credenciales[1].credencial+'"}';
                        this.credencialAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseE=> {
                          for(let i=0;i<responseE.length;i++)
                            if(responseE[i].credencial == datosBloque.credenciales[1].credencial && responseE[i].blocktype=='informativoDinamico')
                              datosBloque.credenciales[1].id_credencial=responseE[i].id_credencial;
                         
                          

                          if(credenciales.length==3){
                            datosBloque.credenciales[2].id_block=datosBloque.id_block;
                            this.credencialAPIService.addDatosCredencialAPI(datosBloque.credenciales[2]).subscribe(response =>{
                              console.log('PASO 10');
                              //const datos='{"id_block": "'+datosBloque.id_block+'", "credencial": "'+datosBloque.credenciales[2].credencial+'"}';
                              this.credencialAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseF=> {
                                for(let i=0;i<responseF.length;i++)
                                  if(responseF[i].credencial == datosBloque.credenciales[2].credencial && responseF[i].blocktype=='informativoDinamico')
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
      } else{
        //EDITAR
        let datosBloque: InterfazViewBlkInfoDin = this.fromBlksInfo.value;
        let credenciales: any[]=[];
        let links: any[]=[];

        datosBloque.id_block = this.bloque.id_block;
        datosBloque.id_robot=this.bloque.id_robot;
        datosBloque.blocktype='informativoDinamico';
        datosBloque.contenttype='text';
        datosBloque.pos_x=this.bloque.pos_x;
        datosBloque.pos_y=this.bloque.pos_y;
        datosBloque.tags_entradas=this.bloque.tags_entradas;

        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO 1');
        let link1={
          id_link: this.bloque.linksAPI[0].id_link,
          blocktype:  'informativoDinamico',
          links:  this.fromBlksInfo.value.link1,
          id_block: this.bloque.id_block
        }
        links.push(link1);
        this.linksAPIService.updateLinksAPI(link1).subscribe(response=>{});
        datosBloque.linksAPI=links;
        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO 2');
        if(this.fromBlksInfo.value.link2 != ''){

          if(this.tamLinks < 2){
            let link2={
              id_link: '13',
              blocktype:  'informativoDinamico',
              links:  this.fromBlksInfo.value.link2,
              id_block: this.bloque.id_block
            }

            this.linksAPIService.addDatosLinksAPI(link2).subscribe(response =>{
              const datos='{"id_block": "'+this.bloque.id_block+'", "links": "'+link2.links+'"}';
              this.linksAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseC=> {
                for(let i=0;i<responseC.length;i++)
                  if(responseC[i].links == link2.links && responseC[i].blocktype=='informativoDinamico')
                    link2.id_link=responseC[i].id_link;
                
                links.push(link2);
                datosBloque.linksAPI=links;
              });
            });

            
          }
          else{
            let link2={
              id_link: this.bloque.linksAPI[1].id_link,
              blocktype: 'informativoDinamico',
              links:  this.fromBlksInfo.value.link2,
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
        

        if(this.fromBlksInfo.value.nomCredencial1 != ''){
          if(this.tamCredenciales > 0){
            let credencial1={
              id_credencial: this.bloque.credenciales[0].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'informativoDinamico',
              namecredencial: this.fromBlksInfo.value.nomCredencial1,
              credencial: this.fromBlksInfo.value.credencial1
            }
            this.credencialAPIService.updateCredencialAPI(credencial1).subscribe(response=>{});
            credenciales.push(credencial1);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial1={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'informativoDinamico',
              namecredencial: this.fromBlksInfo.value.nomCredencial1,
              credencial: this.fromBlksInfo.value.credencial1
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial1).subscribe(response =>{
              //const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial1.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial1.credencial && responseF[i].blocktype=='informativoDinamico')
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




        if(this.fromBlksInfo.value.nomCredencial2 != ''){
          if(this.tamCredenciales > 1){
            let credencial2={
              id_credencial: this.bloque.credenciales[1].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'informativoDinamico',
              namecredencial: this.fromBlksInfo.value.nomCredencial2,
              credencial: this.fromBlksInfo.value.credencial2
            }
            this.credencialAPIService.updateCredencialAPI(credencial2).subscribe(response=>{});
            credenciales.push(credencial2);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial2={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'informativoDinamico',
              namecredencial: this.fromBlksInfo.value.nomCredencial2,
              credencial: this.fromBlksInfo.value.credencial2
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial2).subscribe(response =>{
              const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial2.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial2.credencial && responseF[i].blocktype=='informativoDinamico')
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



        if(this.fromBlksInfo.value.nomCredencial3 != ''){
          if(this.tamCredenciales == 3){
            let credencial3={
              id_credencial: this.bloque.credenciales[2].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'informativoDinamico',
              namecredencial: this.fromBlksInfo.value.nomCredencial3,
              credencial: this.fromBlksInfo.value.nomCredencial3
            }
            this.credencialAPIService.updateCredencialAPI(credencial3).subscribe(response=>{});
            credenciales.push(credencial3);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial3={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'informativoDinamico',
              namecredencial: this.fromBlksInfo.value.nomCredencial3,
              credencial: this.fromBlksInfo.value.nomCredencial3
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial3).subscribe(response =>{
              //const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial3.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial3.credencial && responseF[i].blocktype=='informativoDinamico')
                    credencial3.id_credencial=responseF[i].id_credencial;


                credenciales.push(credencial3);
                datosBloque.credenciales=credenciales;                               
              });
            });
            
            
            
          }
        }
        else if(this.tamCredenciales == 3){
          this.credencialAPIService.deleteCredencialAPI(this.bloque.credenciales[2].id_credencial).subscribe(response=>{});
        }
        
        

        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO6');
        this.blkInfoDinService.updateBlkInfo(datosBloque).subscribe(response=>{
          for(let i=0;i<this.globals.AllBlocks.length;i++){
            for(let j=0;j<this.globals.AllBlocks[i].length;j++){
              if(this.globals.AllBlocks[i][j].id_block == datosBloque.id_block && this.globals.AllBlocks[i][j].blocktype == datosBloque.blocktype){
                this.globals.AllBlocks[i][j]=datosBloque;
                this.globals.AllBlocks[i][j].tags_entradas=datosBloque.tags_entradas;
              }
            }
          }
          //for(let i=0;i<this.globals.AllBlocks.length;i++){
            //for(let j=0;j<this.globals.AllBlocks[i].length;j++){
              //console.log(i+","+j+" -> "+this.globals.AllBlocks[i][j].namestate);
            //}
          //}
          this.editar_tag(datosBloque.opc_nextid, datosBloque.next_id,datosBloque.namestate);
        });
        this.handleSuccessfulEditTodo(datosBloque);
          //.catch(err => console.error(err));
      }
    }

    guardarDatos(datosBloque: any){
      console.log('PASO 11');
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
  
  
    handleSuccessfulSaveTodo(datos: InterfazViewBlkInfoDin) {
      this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
    }
  
    handleSuccessfulEditTodo(datos: InterfazViewBlkInfoDin) {
      this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
    }
  
  
  }
  

