import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfazViewBlkSlideDin, InterfazViewBlkInputDin, InterfazViewBlkQRDin } from '../interfaces/interfaz-view-blk-info';
import { Globals } from '../interfaces/Globals';
import { LinksAPIService } from 'src/app/sendToDB/linksAPI.service';
import { CredencialAPIService } from 'src/app/sendToDB/credenciales.service';
import { BlkQRServiceDin } from 'src/app/sendToDB/blkQRDin.service';

@Component({
  selector: 'app-from-block-qrd',
  templateUrl: './from-block-qrd.component.html',
  styleUrls: ['./from-block-qrd.component.css']
})
export class FromBlockQRDComponent implements OnInit {

  fromBlksQR: FormGroup;
  createMode: boolean=true;
  bloque: InterfazViewBlkQRDin;
  states: string[]=[];
  tamLinks: number=0;
  tamCredenciales: number=0;

  constructor(private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal, 
    private blkQRDinService: BlkQRServiceDin,
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
  
      this.fromBlksQR=this.formBuilder.group({

        namestate: ['', Validators.required],
        contenido: ['', Validators.required],
        opc_nextid: ['',Validators.required],
        next_id: [''],
        typingtime: ['', Validators.required],
        validacion: ['', Validators.required],
        default_id: ['', Validators.required],
        save_var: ['', Validators.required],
        link1: ['', Validators.required],
        link2: [''],
        nomCredencial1: [''],
        credencial1: [''],
        nomCredencial2: [''],
        credencial2: [''],
        nomCredencial3: [''],
        credencial3: ['']
      });
  
      if (!this.createMode) {
        this.loadBloque(this.bloque); 
      }
    }
  
  loadBloque(bloque){
    console.log("Opc NX Edit-> "+ bloque.opc_nextID);
    this.fromBlksQR.patchValue(bloque);
      

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
      save_var: bloque.save_var,
      link1: links[0],
      link2: links[0],
      nomCredencial1: nomC[0],
      credencial1: credenciales[0],
      nomCredencial2: nomC[1],
      credencial2: credenciales[1],
      nomCredencial3: nomC[2],
      credencial3: credenciales[2]
    }
    this.fromBlksQR.patchValue(bloque2);    
  }
    
  
  saveBlockQRDin() {
      if (this.fromBlksQR.invalid) {
        console.log('INVALIDO')
        return;
      }
      
      if (this.createMode){
        console.log('CREAR')
        let datosBloque: InterfazViewBlkQRDin = this.fromBlksQR.value;
        let credenciales: any[]=[];
        let links: any[]=[];

        datosBloque.id_block = '12';
        datosBloque.id_robot=this.globals.RobotSelect.id_robot;
        datosBloque.opciones='';
        datosBloque.blocktype='quickReplyDinamico';
        datosBloque.pos_x=0;
        datosBloque.pos_y=this.globals.AllBlocks.length-1;

        let link1={
          id_link: '13',
          blocktype:  'quickReplyDinamico',
          links:  this.fromBlksQR.value.link1,
          id_block: '1'
        }
        links.push(link1);

        if(this.fromBlksQR.value.link2 != ''){
          let link2={
            id_link: '13',
            blocktype:  'quickReplyDinamico',
            links:  this.fromBlksQR.value.link2,
            id_block: '1'
          }
          links.push(link2);
        }
        datosBloque.linksAPI=links;

        if(this.fromBlksQR.value.nomCredencial2 != ''){
          let credencial1={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'quickReplyDinamico',
            namecredencial: this.fromBlksQR.value.nomCredencial1,
            credencial: this.fromBlksQR.value.credencial1
          }
        credenciales.push(credencial1);
        }

        if(this.fromBlksQR.value.nomCredencial2 != ''){
          let credencial2={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'quickReplyDinamico',
            namecredencial: this.fromBlksQR.value.nomCredencial2,
            credencial: this.fromBlksQR.value.credencial2
          }
          credenciales.push(credencial2);
        }
        if(this.fromBlksQR.value.nomCredencial3 != ''){
          let credencial3={
            id_credencial: '13',
            id_block: '1',
            blocktype: 'quickReplyDinamico',
            namecredencial: this.fromBlksQR.value.nomCredencial3,
            credencial: this.fromBlksQR.value.credencial3
          }
          credenciales.push(credencial3);
        }
        datosBloque.credenciales=credenciales;

        console.log("Opc NX-> "+ datosBloque.opc_nextid);
        console.log("NX-> "+ datosBloque.next_id);
        //todo.updateAt = new Date();
  
        this.blkQRDinService.addDatosBlkQR(datosBloque).subscribe(response =>{
          const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
          this.blkQRDinService.getBlk(datos).subscribe(responseA=> {
            datosBloque.id_block=responseA[0].id_block;
            datosBloque.linksAPI[0].id_block=datosBloque.id_block;

            
            this.linksAPIService.addDatosLinksAPI(datosBloque.linksAPI[0]).subscribe(response =>{
              //const datos='{"id_block": "'+datosBloque.id_block+'", "links": "'+datosBloque.linksAPI[0].links+'"}';
              //console.log('Consulta: id_block-> '+datosBloque.id_block+', links-> '+datosBloque.linksAPI[0].links);
              //console.log('consulta-> '+datos);
              this.linksAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseB=> {                
                for(let i=0;i<responseB.length;i++)
                  if(responseB[i].links == datosBloque.linksAPI[0].links && responseB[i].blocktype=='quickReplyDinamico')
                    datosBloque.linksAPI[0].id_link=responseB[i].id_link;

                if(datosBloque.linksAPI.length==2){
                  datosBloque.linksAPI[1].id_block=datosBloque.id_block;
                  this.linksAPIService.addDatosLinksAPI(datosBloque.linksAPI[1]).subscribe(response =>{
                    //const datos='{"id_block": "'+datosBloque.id_block+'", "links": "'+datosBloque.linksAPI[1].links+'"}';
                    this.linksAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseC=> {
                      for(let i=0;i<responseC.length;i++)
                        if(responseC[i].links == datosBloque.linksAPI[1].links && responseC[i].blocktype=='quickReplyDinamico')
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
                        if(responseD[i].credencial == datosBloque.credenciales[0].credencial && responseD[i].blocktype=='quickReplyDinamico')
                          datosBloque.credenciales[0].id_credencial=responseD[i].id_credencial;
                    
                    

                    if(credenciales.length>1){
                      datosBloque.credenciales[1].id_block=datosBloque.id_block;
                      this.credencialAPIService.addDatosCredencialAPI(datosBloque.credenciales[1]).subscribe(response =>{
                        //const datos='{"id_block": "'+datosBloque.id_block+'", "credencial": "'+datosBloque.credenciales[1].credencial+'"}';
                        this.credencialAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseE=> {
                          for(let i=0;i<responseE.length;i++)
                            if(responseE[i].credencial == datosBloque.credenciales[1].credencial && responseE[i].blocktype=='quickReplyDinamico')
                              datosBloque.credenciales[1].id_credencial=responseE[i].id_credencial;
                         
                          

                          if(credenciales.length==3){
                            datosBloque.credenciales[2].id_block=datosBloque.id_block;
                            this.credencialAPIService.addDatosCredencialAPI(datosBloque.credenciales[2]).subscribe(response =>{
                              //const datos='{"id_block": "'+datosBloque.id_block+'", "credencial": "'+datosBloque.credenciales[2].credencial+'"}';
                              this.credencialAPIService.getAll_ByBlock(datosBloque.id_block).subscribe(responseF=> {
                                for(let i=0;i<responseF.length;i++)
                                  if(responseF[i].credencial == datosBloque.credenciales[2].credencial && responseF[i].blocktype=='quickReplyDinamico')
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

              });
            });

            
          });
        });
      } else{
        //EDITAR
        let datosBloque: InterfazViewBlkQRDin = this.fromBlksQR.value;
        let credenciales: any[]=[];
        let links: any[]=[];

        datosBloque.id_block = this.bloque.id_block;
        datosBloque.id_robot=this.bloque.id_robot;
        datosBloque.blocktype='quickReplyDinamico';
        datosBloque.pos_x=this.bloque.pos_x;
        datosBloque.pos_y=this.bloque.pos_y;

        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO 1');
        let link1={
          id_link: this.bloque.linksAPI[0].id_link,
          blocktype:  'quickReplyDinamico',
          links:  this.fromBlksQR.value.link1,
          id_block: this.bloque.id_block
        }
        links.push(link1);
        this.linksAPIService.updateLinksAPI(link1).subscribe(response=>{});
        datosBloque.linksAPI=links;
        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO 2');
        if(this.fromBlksQR.value.link2 != ''){

          if(this.tamLinks < 2){
            let link2={
              id_link: '13',
              blocktype:  'quickReplyDinamico',
              links:  this.fromBlksQR.value.link2,
              id_block: this.bloque.id_block
            }

            this.linksAPIService.addDatosLinksAPI(link2).subscribe(response =>{
              const datos='{"id_block": "'+this.bloque.id_block+'", "links": "'+link2.links+'"}';
              this.linksAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseC=> {
                for(let i=0;i<responseC.length;i++)
                  if(responseC[i].links == link2.links && responseC[i].blocktype=='quickReplyDinamico')
                    link2.id_link=responseC[i].id_link;
                
                links.push(link2);
                datosBloque.linksAPI=links;
              });
            });

            
          }
          else{
            let link2={
              id_link: this.bloque.linksAPI[1].id_link,
              blocktype: 'quickReplyDinamico',
              links:  this.fromBlksQR.value.link2,
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
        

        if(this.fromBlksQR.value.nomCredencial1 != ''){
          if(this.tamCredenciales > 0){
            let credencial1={
              id_credencial: this.bloque.credenciales[0].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'quickReplyDinamico',
              namecredencial: this.fromBlksQR.value.nomCredencial1,
              credencial: this.fromBlksQR.value.credencial1
            }
            this.credencialAPIService.updateCredencialAPI(credencial1).subscribe(response=>{});
            credenciales.push(credencial1);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial1={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'quickReplyDinamico',
              namecredencial: this.fromBlksQR.value.nomCredencial1,
              credencial: this.fromBlksQR.value.credencial1
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial1).subscribe(response =>{
              //const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial1.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial1.credencial && responseF[i].blocktype=='quickReplyDinamico')
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




        if(this.fromBlksQR.value.nomCredencial2 != ''){
          if(this.tamCredenciales > 1){
            let credencial2={
              id_credencial: this.bloque.credenciales[1].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'quickReplyDinamico',
              namecredencial: this.fromBlksQR.value.nomCredencial2,
              credencial: this.fromBlksQR.value.credencial2
            }
            this.credencialAPIService.updateCredencialAPI(credencial2).subscribe(response=>{});
            credenciales.push(credencial2);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial2={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'quickReplyDinamico',
              namecredencial: this.fromBlksQR.value.nomCredencial2,
              credencial: this.fromBlksQR.value.credencial2
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial2).subscribe(response =>{
              const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial2.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial2.credencial && responseF[i].blocktype=='quickReplyDinamico')
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



        if(this.fromBlksQR.value.nomCredencial3 != ''){
          if(this.tamCredenciales == 3){
            let credencial3={
              id_credencial: this.bloque.credenciales[2].id_credencial,
              id_block: this.bloque.id_block,
              blocktype: 'quickReplyDinamico',
              namecredencial: this.fromBlksQR.value.nomCredencial3,
              credencial: this.fromBlksQR.value.nomCredencial3
            }
            this.credencialAPIService.updateCredencialAPI(credencial3).subscribe(response=>{});
            credenciales.push(credencial3);
            datosBloque.credenciales=credenciales;
            
          }
          else{
            let credencial3={
              id_credencial: '1',
              id_block: this.bloque.id_block,
              blocktype: 'quickReplyDinamico',
              namecredencial: this.fromBlksQR.value.nomCredencial3,
              credencial: this.fromBlksQR.value.nomCredencial3
            }
            this.credencialAPIService.addDatosCredencialAPI(credencial3).subscribe(response =>{
              //const datos='{"id_block": "'+this.bloque.id_block+'", "credencial": "'+credencial3.credencial+'"}';
              this.credencialAPIService.getAll_ByBlock(this.bloque.id_block).subscribe(responseF=> {
                for(let i=0;i<responseF.length;i++)
                  if(responseF[i].credencial == credencial3.credencial && responseF[i].blocktype=='quickReplyDinamico')
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
        
        

        console.log('ACTUALIZANDO EL BLOQUE SLIDE DINAMICO6');
        this.blkQRDinService.updateBlkQR(datosBloque).subscribe(response=>{
          for(let i=0;i<this.globals.AllBlocks.length;i++){
            for(let j=0;j<this.globals.AllBlocks[i].length;j++){
              if(this.globals.AllBlocks[i][j].id_block == datosBloque.id_block && this.globals.AllBlocks[i][j].blocktype == datosBloque.blocktype){
                this.globals.AllBlocks[i][j]=datosBloque;
              }
            }
          }
          for(let i=0;i<this.globals.AllBlocks.length;i++){
            for(let j=0;j<this.globals.AllBlocks[i].length;j++){
              console.log(i+","+j+" -> "+this.globals.AllBlocks[i][j].namestate);
            }
          }
        });
        this.handleSuccessfulEditTodo(datosBloque);
          //.catch(err => console.error(err));
      }
    }

    guardarDatos(datosBloque: any){
      this.globals.AllBlocks.pop();
      this.globals.AllBlocks.push([datosBloque]);
      this.globals.AllBlocks[this.globals.AllBlocks.length-1][0].opc_nextid=datosBloque.opc_nextid;
      this.globals.AllBlocks.push([]);
      let result= this.globals.generar_Id();


      this.handleSuccessfulSaveTodo(datosBloque);
    }
  
  
    handleSuccessfulSaveTodo(datos: InterfazViewBlkQRDin) {
      this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
    }
  
    handleSuccessfulEditTodo(datos: InterfazViewBlkQRDin) {
      this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
    }
  
  
}
  




