import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FromBlockInfoComponent } from '../../bloques/from-block-info/from-block-info.component';
import { FromBlockInputComponent } from '../../bloques/from-block-input/from-block-input.component';
import { FromBlockQRComponent } from '../../bloques/from-block-qr/from-block-qr.component';
import { FromBlockSlideComponent } from '../../bloques/from-block-slide/from-block-slide.component';
import { FromBlockInfoDComponent } from '../../bloques/from-block-info-d/from-block-info-d.component';
import { InterfazViewBlkInfo, InterfazViewBlkInput, InterfazViewBlkQR } from '../../bloques/interfaces/interfaz-view-blk-info';
import { BlkInfoService } from './../../../sendToDB/blkInfo.service';
import { BlkInputService } from './../../../sendToDB/blkInput.service';
import { BlkQRService } from './../../../sendToDB/blkQR.service';
import { BlkSlideService } from './../../../sendToDB/blkSlide.service';
import { ElementoService } from './../../../sendToDB/elementos.service';
import { BotonesService } from './../../../sendToDB/botones.service';
import { BlkInternalPrs } from './../../../sendToDB/blkInternalPrs.service';
import { OperacionesService } from './../../../sendToDB/operaciones.service';
import { variablesService } from './../../../sendToDB/variables.service';
import { Globals } from '../../bloques/interfaces/Globals';
import { BlkInfoServiceDin } from 'src/app/sendToDB/blkInfoDin.service';
import { LinksAPIService } from 'src/app/sendToDB/linksAPI.service';
import { CredencialAPIService } from 'src/app/sendToDB/credenciales.service';
import { BlkSlideServiceDin } from 'src/app/sendToDB/blkSlideDin.service';
import { FromBlockSlideDComponent } from '../../bloques/from-block-slide-d/from-block-slide-d.component';
import { FromBlockInputDComponent } from '../../bloques/from-block-input-d/from-block-input-d.component';
import { BlkInputServiceDin } from 'src/app/sendToDB/blkIputDin.service';
import { FromBlockQRDComponent } from '../../bloques/from-block-qrd/from-block-qrd.component';
import { FromBlockInternalPrsComponent } from '../../bloques/componentes/from-block-internal-prs/from-block-internal-prs.component';
import { BlkQRServiceDin } from 'src/app/sendToDB/blkQRDin.service';
@Component({
  selector: 'app-construccion-cb',
  templateUrl: './construccion-cb.component.html',
  styleUrls: ['./construccion-cb.component.css'],
})
export class ConstruccionCBComponent implements OnInit {

  createMode: boolean = true;
  Nstates: string[] = [];
  indexBuild: number= 0;
  bloqueInicial: any;
  tam: any[]=[0,0];
  

  constructor(private modalService: NgbModal,
    private blokInputservice: BlkInputService, 
    private blokInfoservice: BlkInfoService,
    private blokQRservice: BlkQRService,
    private blokSlideservice: BlkSlideService, 
    private blokSlideDService: BlkSlideServiceDin,
    private blokInputDService: BlkInputServiceDin,
    private blkInfoDService: BlkInfoServiceDin,
    private linksAPIService: LinksAPIService,
    private blokQRDservice: BlkQRServiceDin,
    private credencialAPIService: CredencialAPIService,
    private elementoService: ElementoService,
    private botonesService: BotonesService,
    private blokInternalPrsService: BlkInternalPrs,
    private opcService: OperacionesService,
    private varService: variablesService, 
    public globals: Globals
    ) { }

  ngOnInit() {
    if (typeof window.innerWidth != 'undefined'){
      this.tam = [window.innerWidth,window.innerHeight];
      //console.log("Caso 1-> Ancho: "+this.tam[0]+", largo: "+this.tam[1]);
    }/*
    else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0)
    {
      this.tam = [
          document.documentElement.clientWidth,
          document.documentElement.clientHeight
      ];
      alert("Caso 2-> Ancho: "+this.tam[0]+", largo: "+this.tam[1]);
    }*/

    let shand = document.getElementsByClassName("tamlienzo") as HTMLCollectionOf<HTMLElement>;
    let tam= this.tam[1]-60;
    shand[0].setAttribute("style", "height: "+tam+"px; overflow: auto;");

    //  let shand2 = document.getElementsByClassName("table table-striped") as HTMLCollectionOf<HTMLElement>;
    //let tam2= this.tam[1]-76;
    //shand2[0].setAttribute("style", "height: "+tam2+"px;");


    this.globals.AllBlocks=[];
    this.globals.PenultimaEdBlks=[];
    
    if(this.globals.estado=='interfaz')
      this.bloque_inicial();
    else if(this.globals.estado=='editar'){
      this.globals.AllBlocks.push([]);
      this.load_vars();
    }
  }

  

  bloque_inicial(){
    this.bloqueInicial={
      id_block: '1',
      namestate: 'Saludo',
      id_robot: this.globals.RobotSelect.id_robot,
      contenido: 'Hola, espero que estes teniendo un excelente dia.',
      opc_nextid: 'Generar automaticamente',
      next_id: '',
      blocktype: 'informativo',
      contenttype: 'text',
      typingtime: '1',
      pos_x: 0,
      pos_y: 0
    }

    this.blokInfoservice.addDatosBlkInfo(this.bloqueInicial).subscribe(response =>{
      const datos='{"id_robot": "'+this.bloqueInicial.id_robot+'", "namestate": "'+this.bloqueInicial.namestate+'"}';
      this.blokInfoservice.getBlk(datos).subscribe(response=> {
        response[0].opc_nextid='Generar automaticamente'; 
        response[0].tags_entradas=[];
        this.globals.AllBlocks.push([response[0]]);
        this.globals.AllBlocks.push([]);
      });
      
    });  
    
    this.globals.tabla_vars=[];

    
  }

  load_vars(){
    this.varService.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(responseVars=>{
      this.globals.tabla_vars = responseVars;
    });
    this.loadTodosBlkInfo();
  }
  
  loadTodosBlkInfo() {
    let ConsultaBloques:any[]=[];
    this.blokInfoservice.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      //console.log("-------------Consultando Bot--------------");
      ConsultaBloques=response;
      let max_X: number=response[0].pos_x;
      let max_Y: number=response[0].pos_y;
      //console.log("Max_X-0: "+max_X+", Max_Y-0: "+max_Y);
      for(let i=1;i<response.length;i++){
        console.log("NameState: "+response[i].namestate);
        console.log("Max_X-0: "+max_X+","+response[i].pos_x+", Max_Y-0: "+max_Y+","+response[i].pos_y);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;
      }
      //console.log("Max_X-Inf: "+max_X+", Max_Y-Inf: "+max_Y);
      this.loadTodosBlkInput(ConsultaBloques, max_X, max_Y);
    });
  }
  
  loadTodosBlkInput(ConsultaBloques: any, max_X: number, max_Y: number) {
    this.blokInputservice.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      for(let i=0;i<response.length;i++){
        ConsultaBloques.push(response[i]);
        console.log("Max_X-0: "+max_X+","+response[i].pos_x+", Max_Y-0: "+max_Y+","+response[i].pos_y);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;
      }
      //console.log("Max_X-Inp: "+max_X+", Max_Y-Inp: "+max_Y);
      this.loadTodosBlkQR(ConsultaBloques, max_X, max_Y);
    });
  }
  
  loadTodosBlkQR(ConsultaBloques: any, max_X: number, max_Y: number) {
    this.blokQRservice.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      for(let i=0;i<response.length;i++){
        ConsultaBloques.push(response[i]);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;
      }
      //console.log("Max_X-QR: "+max_X+", Max_Y-QR: "+max_Y);
      this.loadTodosBlkSlide(ConsultaBloques, max_X, max_Y);
    });    
  }

  loadTodosBlkSlide(ConsultaBloques: any, max_X: number, max_Y: number) {
    this.blokSlideservice.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      for(let i=0;i<response.length;i++){
        let bloque=response[i];
        let elementos: any[]=[];
        let cont_elm: number=0;
        //console.log("Max_X-0: "+max_X+","+response[i].pos_x+", Max_Y-0: "+max_Y+","+response[i].pos_y);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;
        
        this.elementoService.getAll_ByBlock(response[i].id_block).subscribe(responseB=> {
          for(let j=0;j<responseB.length;j++)
            if(responseB[j].blocktype=='slide'){
              elementos.push(responseB[j]);
              let botones: any[]=[];
              this.botonesService.getAll_ByELM(responseB[j].id_elements).subscribe(responseC=> {
                for(let k=0;k<responseC.length;k++){
                  botones.push(responseC[k]);
                }                 
    
                elementos[cont_elm].botones=botones;
                cont_elm=cont_elm+1;
              });
              
            }       
          bloque.elementos=elementos;
          ConsultaBloques.push(bloque);
        });
      }
      this.loadTodosBlkInternalProcess(ConsultaBloques, max_X, max_Y);
    });    
  }

  loadTodosBlkInternalProcess(ConsultaBloques: any, max_X: number, max_Y: number){
    this.blokInternalPrsService.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      for(let i=0;i<response.length;i++){
        let bloque=response[i];
        let operaciones: any[]=[];
        let cont_opc: number=0;
        response[i].tag_salida=false;
        //console.log("Max_X-0: "+max_X+","+response[i].pos_x+", Max_Y-0: "+max_Y+","+response[i].pos_y);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;
        
        this.opcService.getAll_ByBlock(response[i].id_block).subscribe(responseB=> {
          for(let j=0;j<responseB.length;j++){
            responseB[j].variables=[];
            operaciones.push(responseB[j]);
            let variables: any[]=[];
            if(responseB[j].type_operation != 'else'){
              this.varService.getVar(responseB[j].id_var_1).subscribe(responseVar1=> {
                variables.push(responseVar1[0]);

                this.varService.getVar(responseB[j].id_var_2).subscribe(responseVar2=> {
                  variables.push(responseVar2[0]);
                  operaciones[cont_opc].variables=variables;
                  cont_opc=cont_opc+1;
                });
              });
            }
            else{
              cont_opc=cont_opc+1;
            }
               
          }    
          bloque.operaciones=operaciones;
          ConsultaBloques.push(bloque);
        });
      }
      //console.log("Max_X-Slide: "+max_X+", Max_Y-Slide: "+max_Y);
      this.loadTodosBlkInfoDin(ConsultaBloques, max_X, max_Y);
    });  
  }

  loadTodosVariables(ConsultaBloques: any, max_X: number, max_Y: number){
    this.varService.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      for(let i=0;i<response.length;i++)
        this.globals.tabla_vars.push(response[i]);
      //console.log("Max_X-QR: "+max_X+", Max_Y-QR: "+max_Y);
      this.loadTodosBlkInfoDin(ConsultaBloques, max_X, max_Y);
    });
  }

  loadTodosBlkInfoDin(ConsultaBloques: any, max_X: number, max_Y: number) {
    let credenciales: any[]=[];
    let links: any[]=[];

    this.blkInfoDService.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      for(let i=0;i<response.length;i++){
        credenciales=[];
        links=[];
        ConsultaBloques.push(response[i]);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;

        this.linksAPIService.getAll_ByBlock(response[i].id_block).subscribe(responseB=> {
          for(let j=0;j<responseB.length;j++)
            if(responseB[j].blocktype=='informativoDinamico')
              links.push(responseB[j]);
          
          this.credencialAPIService.getAll_ByBlock(response[i].id_block).subscribe(responseC=> {
            for(let k=0;k<responseC.length;k++)
              if(responseC[k].blocktype=='informativoDinamico')
                credenciales.push(responseC[k]);

            //console.log("Max_X-0: "+max_X+","+response[i].pos_x+", Max_Y-0: "+max_Y+","+response[i].pos_y);
            ConsultaBloques[ConsultaBloques.length-1].linksAPI=links;
            ConsultaBloques[ConsultaBloques.length-1].credenciales=credenciales;
          });
        });

        
      }
      //console.log("Max_X-Slide: "+max_X+", Max_Y-Slide: "+max_Y);
      this.loadTodosBlkSlideDin(ConsultaBloques, max_X, max_Y);

    });    
  }


  loadTodosBlkSlideDin(ConsultaBloques: any, max_X: number, max_Y: number) {
    let credenciales: any[]=[];
    let links: any[]=[];

    this.blokSlideDService.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      
      for(let i=0;i<response.length;i++){
        credenciales=[];
        links=[];
        ConsultaBloques.push(response[i]);
        //console.log(i+'-> resp: '+response[i].namestate);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;

        this.linksAPIService.getAll_ByBlock(response[i].id_block).subscribe(responseB=> {
          for(let j=0;j<responseB.length;j++)
            if(responseB[j].blocktype=='slideDinamico')
              links.push(responseB[j]);
            
          this.credencialAPIService.getAll_ByBlock(response[i].id_block).subscribe(responseC=> {
            for(let k=0;k<responseC.length;k++)
              if(responseC[k].blocktype=='slideDinamico')
                credenciales.push(responseC[k]);
  
            //console.log("Max_X-0: "+max_X+","+response[i].pos_x+", Max_Y-0: "+max_Y+","+response[i].pos_y);
            ConsultaBloques[ConsultaBloques.length-1].linksAPI=links;
            ConsultaBloques[ConsultaBloques.length-1].credenciales=credenciales;
          });
        });
      }
      //console.log("Max_X-Slide: "+max_X+", Max_Y-Slide: "+max_Y);
      this.loadTodosBlkInputDin(ConsultaBloques, max_X, max_Y);

    });    
  }

  loadTodosBlkInputDin(ConsultaBloques: any, max_X: number, max_Y: number) {
    let credenciales: any[]=[];
    let links: any[]=[];

    this.blokInputDService.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      
      for(let i=0;i<response.length;i++){
        credenciales=[];
        links=[];
        ConsultaBloques.push(response[i]);
        //console.log(i+'-> resp: '+response[i].namestate);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;

        this.linksAPIService.getAll_ByBlock(response[i].id_block).subscribe(responseB=> {
          for(let j=0;j<responseB.length;j++)
            if(responseB[j].blocktype=='inputDinamico')
              links.push(responseB[j]);
            
          this.credencialAPIService.getAll_ByBlock(response[i].id_block).subscribe(responseC=> {
            for(let k=0;k<responseC.length;k++)
              if(responseC[k].blocktype=='inputDinamico')
                credenciales.push(responseC[k]);
  
            //console.log("Max_X-0: "+max_X+","+response[i].pos_x+", Max_Y-0: "+max_Y+","+response[i].pos_y);
            ConsultaBloques[ConsultaBloques.length-1].linksAPI=links;
            ConsultaBloques[ConsultaBloques.length-1].credenciales=credenciales;
          });
        });
      }
      //console.log("Max_X-Slide: "+max_X+", Max_Y-Slide: "+max_Y);
      this.loadTodosBlkQRDin(ConsultaBloques, max_X, max_Y);

    });    
  }

  loadTodosBlkQRDin(ConsultaBloques: any, max_X: number, max_Y: number) {
    let credenciales: any[]=[];
    let links: any[]=[];

    this.blokQRDservice.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response=> {
      
      for(let i=0;i<response.length;i++){
        credenciales=[];
        links=[];
        ConsultaBloques.push(response[i]);
        //console.log(i+'-> resp: '+response[i].namestate);
        if(max_X<response[i].pos_x)
          max_X=response[i].pos_x;
        if(max_Y<response[i].pos_y)
          max_Y=response[i].pos_y;

        this.linksAPIService.getAll_ByBlock(response[i].id_block).subscribe(responseB=> {
          for(let j=0;j<responseB.length;j++)
            if(responseB[j].blocktype=='quickReplyDinamico')
              links.push(responseB[j]);
            
          this.credencialAPIService.getAll_ByBlock(response[i].id_block).subscribe(responseC=> {
            for(let k=0;k<responseC.length;k++)
              if(responseC[k].blocktype=='quickReplyDinamico')
                credenciales.push(responseC[k]);
  
            //console.log("Max_X-0: "+max_X+","+response[i].pos_x+", Max_Y-0: "+max_Y+","+response[i].pos_y);
            ConsultaBloques[ConsultaBloques.length-1].linksAPI=links;
            ConsultaBloques[ConsultaBloques.length-1].credenciales=credenciales;
          });
        });
      }
      //console.log("Max_X-Slide: "+max_X+", Max_Y-Slide: "+max_Y);
      this.reconstruirChatbot(ConsultaBloques, max_X, max_Y);

    });    
  }


  reconstruirChatbot(ConsultaBloques: any, max_X: number, max_Y: number){
    console.log('max_X-Final-> '+max_X+', max_Y-Final-> '+max_Y);
    let reconstruccion: any[]=[];

    for(let i=0;i<=max_Y;i++){
      reconstruccion.push([]);
      for(let j=0;j<=max_X;j++){
        reconstruccion[i].push({namestate:'blk-cb-pyt1?'});
      }
    }

    for(let i=0;i<ConsultaBloques.length;i++){
      reconstruccion[ConsultaBloques[i].pos_y][ConsultaBloques[i].pos_x]=ConsultaBloques[i];
      reconstruccion[ConsultaBloques[i].pos_y][ConsultaBloques[i].pos_x].tags_entradas=[];
    }

    for(let i=max_Y;i>=0;i--){
      for(let j=max_X;j>=0;j--){
        if(reconstruccion[i][j].namestate=='blk-cb-pyt1?')
          reconstruccion[i].pop();
        else
          break;        
      }
    }

    
    
      
    //console.log("---------Reconstruccion--------");
    //for(let i=0;i<reconstruccion.length;i++){
      //for(let j=0;j<reconstruccion[i].length;j++){
        //console.log(i+'-> namestate: '+reconstruccion[i][j].namestate+', x:'+reconstruccion[i][j].pos_x+', y:'+reconstruccion[i][j].pos_y+" - xa:"+j+", ya:"+i);        
      //}
    //}
    //console.log("---------Fin--------");

    this.globals.AllBlocks=reconstruccion;
    this.globals.AllBlocks.push([]);
    this.globals.PenultimaEdBlks=reconstruccion;




    //for(let i=0;i<ConsultaBloques.length;i++){
      //console.log(i+'-> Id_block: '+ConsultaBloques[i].id_block+', namestate: '+ConsultaBloques[i].namestate+', type: '+ConsultaBloques[i].blocktype+', x:'+ConsultaBloques[i].pos_x+', y:'+ConsultaBloques[i].pos_y);
    //}

    this.construir_tags();

  }

  construir_tags(){
    //console.log("------------------TAGS:");

    for(let i=0;i<this.globals.AllBlocks.length;i++)
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        if((this.globals.AllBlocks[i][j].blocktype=='informativo' || this.globals.AllBlocks[i][j].blocktype=='input' || this.globals.AllBlocks[i][j].blocktype=='quickReply' || this.globals.AllBlocks[i][j].blocktype=='informativoDinamico' || this.globals.AllBlocks[i][j].blocktype=='slideDinamico' || this.globals.AllBlocks[i][j].blocktype=='inputDinamico' || this.globals.AllBlocks[i][j].blocktype=='quickReplyDinamico') && this.globals.AllBlocks[i][j].opc_nextid== 'Seleccionar de la lista'){
          this.generar_tag_caso1(i,j);
        }
        else if(this.globals.AllBlocks[i][j].blocktype=='slide'){
          this.globals.AllBlocks[i][j].tag_salida=false;
          if(this.globals.AllBlocks[i][j].opc_elm=='Una sola transición' && this.globals.AllBlocks[i][j].opc_nextid== 'Seleccionar de la lista')
            this.generar_tag_caso1(i,j);
          else if(this.globals.AllBlocks[i][j].opc_elm=='Una transición por elemento'){
            for(let elm=0;elm<this.globals.AllBlocks[i][j].elementos.length;elm++)
              for(let cont_btn=0;cont_btn<this.globals.AllBlocks[i][j].elementos[elm].botones.length;cont_btn++)
                if(this.globals.AllBlocks[i][j].elementos[elm].botones[cont_btn].opc_nextid == "Seleccionar de la lista"){
                  this.globals.AllBlocks[i][j].tag_salida=true;
                  for(let f=0;f<this.globals.AllBlocks.length;f++)
                    for(let k=0;k<this.globals.AllBlocks[f].length;k++)
                      if(this.globals.AllBlocks[i][j].elementos[elm].botones[cont_btn].contentbutton == this.globals.AllBlocks[f][k].namestate){
                        this.globals.AllBlocks[f][k].tags_entradas.push(this.globals.AllBlocks[i][j].namestate+" -> "+this.globals.AllBlocks[i][j].elementos[elm].title+" -> "+this.globals.AllBlocks[i][j].elementos[elm].botones[cont_btn].titlebutton);
                        break;
                      }
                }
          }
          
        }
        else if(this.globals.AllBlocks[i][j].blocktype=='internalProcess'){
          this.crear_tag(this.globals.AllBlocks[i][j].opc_nextid, this.globals.AllBlocks[i][j].default_nextid, this.globals.AllBlocks[i][j].namestate, i, j);

          for(let cont_opc=0;cont_opc<this.globals.AllBlocks[i][j].operaciones.length;cont_opc++){
            if(this.globals.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'if' || this.globals.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'else')
              this.crear_tag(this.globals.AllBlocks[i][j].operaciones[cont_opc].opc_nextid, this.globals.AllBlocks[i][j].operaciones[cont_opc].next_id, this.globals.AllBlocks[i][j].namestate, i, j);
          }
        }
        
          
      }         
              
  }

  crear_tag(opc_nextid: string, next_id: string, namestate, i: number, j: number){
    if(opc_nextid == 'Seleccionar de la lista'){
      this.globals.AllBlocks[i][j].tag_salida=true;
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == next_id){
            this.globals.AllBlocks[i][j].tags_entradas.push(namestate);
            return;
          }
    }
  }

  generar_tag_caso1(i: number, j: number){
    let arr_opc_nextid: any;
    let arr_next_id: any;

    arr_opc_nextid=this.globals.AllBlocks[i][j].opc_nextid.split(",");
    arr_next_id=this.globals.AllBlocks[i][j].next_id.split(",");
    //console.log("arr_opc_nextid: "+arr_opc_nextid.length);
    //console.log("arr_nextid: "+arr_next_id.length);
    for(let cont_nx=0;cont_nx<arr_next_id.length;cont_nx++)

      if(arr_opc_nextid[cont_nx]=="Seleccionar de la lista"){
        //console.log("Seleccionar de la lista: "+this.globals.AllBlocks[i][j].namestate);
        for(let y=0;y<this.globals.AllBlocks.length;y++)
          for(let x=0;x<this.globals.AllBlocks[y].length;x++)
            if(this.globals.AllBlocks[y][x].namestate==arr_next_id[cont_nx]){
              //console.log("tam: "+this.globals.AllBlocks[y][x].tags_entradas.length);
              this.globals.AllBlocks[y][x].tags_entradas.push(this.globals.AllBlocks[i][j].namestate)
              //console.log("tam1: "+this.globals.AllBlocks[y][x].tags_entradas.length);
              //for(let pp=0;pp<this.globals.AllBlocks[y][x].tags_entradas.length;pp++)
                //console.log("entrada: "+this.globals.AllBlocks[y][x].tags_entradas[pp]);
            }
      } 
  }


  posicion_bloques(index2: any){
    //console.log("----------COSNTRUCCION DE LINEAS-------");
    //document.getElementById("limpiar").innerHTML="";
    //document.getElementsByClassName("connector_canvas").
    let shand = document.getElementsByClassName("connector_canvas");    
    let bloques_pos = document.getElementsByClassName("conf");
    let num_lienzos=0;
    let cont_lienzos=0;
    let cont_bloques=0;
    let cont_por_fila=0;
    
    //shand[0].setAttribute("style", "height: "+this.tam[1]+"px;");
    //for(let i=0;i<this.globals.AllBlocks.length;i++){
      //for(let j=0;j<this.globals.AllBlocks[i].length;j++)
        //if(this.globals.AllBlocks[i])

    //}
      
    //shand[0].insertAdjacentHTML('beforeend', '<div id="linea"  style="background: red; position:absolute; margin: 0; width: 1px; height: 50px; border-bottom: 1px solid black; -webkit-transform: translateY(0px) translateX(20px) rotate(45deg); " ></div>');
    //console.log("Tam SVG: "+shand.length);
    //console.log("Index2: "+index2);
    //console.log("bloques: "+bloques_pos.length); 

    for(let i=0;i<index2;i++){
      if(i > 0 && this.globals.AllBlocks[i-1].length > 0 && this.globals.AllBlocks[i].length > 0){
        shand[num_lienzos].innerHTML="";
        num_lienzos=num_lienzos+1;
      }      
    }
    shand[num_lienzos].innerHTML="";
    let sig_estados: any;
    let opc_sig_estados: any;
    let posicion;
    let pos_boton;
    let posicion_btn;

    //console.log("-----------Tam arr:"+(this.globals.AllBlocks.length-2))  ;
    //console.log("-----------index2:"+index2);
    
    if((this.globals.AllBlocks.length-2)==index2){
      pos_boton = document.getElementsByClassName("boton_add_circle");
      posicion_btn = pos_boton[0].getBoundingClientRect();

      for(let i=0;i<(this.globals.AllBlocks.length-1);i++){        
        cont_por_fila=cont_por_fila+this.globals.AllBlocks[i].length;
        if(this.globals.AllBlocks[i+1].length > 0 && this.globals.AllBlocks[i].length > 0){        
        
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){          
            //console.log("@@@-Nom_estado "+cont_bloques+": "+this.globals.AllBlocks[i][j].namestate);
            posicion = bloques_pos[j+cont_bloques].getBoundingClientRect();
            //console.log(posicion.top, posicion.right, posicion.bottom, posicion.left);
            //shand[cont_lienzos].insertAdjacentHTML('beforeend', '<line x1="'+(posicion.right-470)+'" y1="0" x2="30.01136016845703" y2="35.98863220214844"></line>');
            if((this.globals.AllBlocks[i][j].blocktype=='informativo' || this.globals.AllBlocks[i][j].blocktype=='input' || this.globals.AllBlocks[i][j].blocktype=='quickReply' || this.globals.AllBlocks[i][j].blocktype=='informativoDinamico' || this.globals.AllBlocks[i][j].blocktype=='slideDinamico' || this.globals.AllBlocks[i][j].blocktype=='inputDinamico' || this.globals.AllBlocks[i][j].blocktype=='quickReplyDinamico') || (this.globals.AllBlocks[i][j].blocktype=='slide' && this.globals.AllBlocks[i][j].opc_elm=='Una sola transición' && this.globals.AllBlocks[i][j].opc_nextid== 'Generar automaticamente')){
              opc_sig_estados=this.globals.AllBlocks[i][j].opc_nextid.split(",");
              sig_estados=this.globals.AllBlocks[i][j].next_id.split(",");
              for(let x=0;x<opc_sig_estados.length;x++){
                //console.log("@@@@@-OPC_sig "+x+": "+opc_sig_estados[x]);
                if(opc_sig_estados[x] == "Generar automaticamente"){
                  //console.log("@@@@@@-sig_estados "+x+": "+sig_estados[x]);
                  //console.log("@@@@@@-lienzo: "+cont_lienzos+", cont_bloques: "+(j+cont_bloques));
                  this.buscar_sig_estado(sig_estados[x], i+1, shand[cont_lienzos], posicion.right, posicion.left, bloques_pos, cont_por_fila, posicion_btn.right);
                  
                } 
              }
            }
            else if(this.globals.AllBlocks[i][j].blocktype=='slide' && this.globals.AllBlocks[i][j].opc_elm=='Una transición por elemento'){
              for(let x=0;x<this.globals.AllBlocks[i][j].elementos.length;x++){
                for(let cont_btn=0;cont_btn<this.globals.AllBlocks[i][j].elementos[x].botones.length;cont_btn++)
                  if(this.globals.AllBlocks[i][j].elementos[x].botones[cont_btn].opc_nextid == "Generar automaticamente"){
                    //console.log("@@@@@@-sig_estados "+x+": "+sig_estados[x]);
                    //console.log("@@@@@@-lienzo: "+cont_lienzos+", cont_bloques: "+(j+cont_bloques));
                    this.buscar_sig_estado(this.globals.AllBlocks[i][j].elementos[x].botones[cont_btn].contentbutton, i+1, shand[cont_lienzos], posicion.right, posicion.left, bloques_pos, cont_por_fila, posicion_btn.right);      
                    
                  } 
              }

            }
            else if(this.globals.AllBlocks[i][j].blocktype == 'internalProcess'){
              if(this.globals.AllBlocks[i][j].opc_nextid == 'Generar automaticamente')
                this.buscar_sig_estado(this.globals.AllBlocks[i][j].default_nextid, i+1, shand[cont_lienzos], posicion.right, posicion.left, bloques_pos, cont_por_fila, posicion_btn.right);
              for(let cont_opc=0; cont_opc<this.globals.AllBlocks[i][j].operaciones.length; cont_opc++){
                if((this.globals.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'if' || this.globals.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'else') && this.globals.AllBlocks[i][j].operaciones[cont_opc].opc_nextid == 'Generar automaticamente')
                  this.buscar_sig_estado(this.globals.AllBlocks[i][j].operaciones[cont_opc].next_id, i+1, shand[cont_lienzos], posicion.right, posicion.left, bloques_pos, cont_por_fila, posicion_btn.right);
              }
            }
            //cont_bloques=cont_bloques+1;
          }
          cont_lienzos=cont_lienzos+1;
        }
        cont_bloques=cont_bloques+this.globals.AllBlocks[i].length;
      }      

    }
      
  
  }

  buscar_sig_estado(sig_estado: string, i: number, shand: any, posicion_right: any, posicion_left: any, bloques_pos: any, cont_por_fila: number, posicion_btn: any){
    let posicion;
    //let pos_boton = document.getElementsByClassName("boton_add_circle");
    //let posicion_btn = pos_boton[0].getBoundingClientRect();    
    
    for(let j=0;j<this.globals.AllBlocks[i].length;j++)
      if(sig_estado == this.globals.AllBlocks[i][j].namestate){
        posicion=bloques_pos[cont_por_fila+j].getBoundingClientRect();      
        //shand.insertAdjacentHTML('beforeend', '<line x1="'+(posicion_right-530)+'" y1="0" x2="'+(posicion.right-530)+'" y2="97"></line>');
        shand.insertAdjacentHTML('beforeend', '<line x1="'+(posicion_right-posicion_btn-215)+'" y1="0" x2="'+(posicion.right-posicion_btn-215)+'" y2="97"></line>');
      }
       
  }



  handleEditClickBlk(bloque: any) {
    let modal: any='';
    if(bloque.blocktype=='informativo'){
      modal=this.modalService.open(FromBlockInfoComponent);      
    }
    else if(bloque.blocktype=='input'){
      modal=this.modalService.open(FromBlockInputComponent);      
    }
    else if(bloque.blocktype=='quickReply'){
      modal=this.modalService.open(FromBlockQRComponent);      
    }
    else if(bloque.blocktype=='slide'){
      modal=this.modalService.open(FromBlockSlideComponent);      
    }
    else if(bloque.blocktype=='informativoDinamico'){
      modal=this.modalService.open(FromBlockInfoDComponent);      
    }
    else if(bloque.blocktype=='slideDinamico'){
      modal=this.modalService.open(FromBlockSlideDComponent);      
    }
    else if(bloque.blocktype=='inputDinamico'){
      modal=this.modalService.open(FromBlockInputDComponent);      
    }
    else if(bloque.blocktype=='quickReplyDinamico'){
      modal=this.modalService.open(FromBlockQRDComponent);      
    }
    else if(bloque.blocktype=='internalProcess'){
      modal=this.modalService.open(FromBlockInternalPrsComponent);      
    }
    
    //const modal = this.modalService.open(FromBlockInfoComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    )
    modal.componentInstance.createMode = false;
    modal.componentInstance.bloque = bloque; 
    this.globals.generar_Id();  
  }

  handleModalTodoFormClose(response) {

  }  

  handleDeleteClickBlk(bloque: any, index: number) { 
    if(bloque.blocktype=='informativo'){
      this.blokInfoservice.deleteBlkInfo(bloque.id_block).subscribe(response=>{ 
        this.deleteBlkArry(bloque, index);
      });
    }
    else if(bloque.blocktype=='input'){
      this.blokInputservice.deleteBlkInput(bloque.id_block).subscribe(response=>{ 
        this.deleteBlkArry(bloque, index);
      });
    }
    else if(bloque.blocktype=='quickReply'){
      this.blokQRservice.deleteBlkQR(bloque.id_block).subscribe(response=>{        
        this.deleteBlkArry(bloque, index);
      });
    }
    else if(bloque.blocktype=='slide'){
      this.blokSlideservice.deleteBlkSlide(bloque.id_block).subscribe(response=>{ 
        this.elementoService.deleteElementosBLK(bloque.id_block).subscribe (response=>{});
        for(let i=0;i<bloque.elementos.length;i++)
          this.botonesService.deleteBotonELM(bloque.elementos[i].id_elements).subscribe (response=>{});
        this.deleteBlkArry(bloque, index);
      });
    }
    else if(bloque.blocktype=='internalProcess'){
      this.blokInternalPrsService.deleteBlkInternalPrs(bloque.id_block).subscribe(response=>{ 
        for(let i=0;i<bloque.operaciones.length;i++){
          if(bloque.operaciones[i].opc_nextid == 'Seleccionar de la lista'){
            for(let i_=0;i_<this.globals.AllBlocks.length;i_++)
              for(let j=0;j<this.globals.AllBlocks[i_].length;j++)
                if(bloque.operaciones[i].next_id == this.globals.AllBlocks[i_][j].namestate){
                  for(let y=0;y<this.globals.AllBlocks[i_][j].tags_entradas.length;y++)
                    if(this.globals.AllBlocks[i_][j].tags_entradas[y]==bloque.namestate){
                      this.globals.AllBlocks[i_][j].tags_entradas.splice(y, 1);
                      break;
                    }
                }
          }
          this.opcService.deleteOpc(bloque.operaciones[i].id_operacion).subscribe (response=>{
          if((bloque.operaciones.length-1) == i)
              this.deleteBlkArry(bloque, index);
          });
        }
        
      });
    }
    else if(bloque.blocktype=='informativoDinamico'){
      this.blkInfoDService.deleteBlkInfo(bloque.id_block).subscribe(response=>{
        for(let i=0;i<bloque.linksAPI.length;i++)
          this.linksAPIService.deleteLinksAPI(bloque.linksAPI[i].id_link).subscribe(response=>{});
        for(let i=0;i<bloque.linksAPI.length;i++)
          this.credencialAPIService.deleteCredencialAPI(bloque.credenciales[i].id_credencial).subscribe(response=>{});
        this.deleteBlkArry(bloque, index);
      });
    }
    else if(bloque.blocktype=='slideDinamico'){
      this.blokSlideDService.deleteBlkSlide(bloque.id_block).subscribe(response=>{
        for(let i=0;i<bloque.linksAPI.length;i++)
          this.linksAPIService.deleteLinksAPI(bloque.linksAPI[i].id_link).subscribe(response=>{});
        for(let i=0;i<bloque.linksAPI.length;i++)
          this.credencialAPIService.deleteCredencialAPI(bloque.credenciales[i].id_credencial).subscribe(response=>{});
        this.deleteBlkArry(bloque, index);
      });
    }
    else if(bloque.blocktype=='inputDinamico'){
      this.blokInputDService.deleteBlkInput(bloque.id_block).subscribe(response=>{
        for(let i=0;i<bloque.linksAPI.length;i++)
          this.linksAPIService.deleteLinksAPI(bloque.linksAPI[i].id_link).subscribe(response=>{});
        for(let i=0;i<bloque.linksAPI.length;i++)
          this.credencialAPIService.deleteCredencialAPI(bloque.credenciales[i].id_credencial).subscribe(response=>{});
        this.deleteBlkArry(bloque, index);
      });
    }
    else if(bloque.blocktype=='quickReplyDinamico'){
      this.blokQRDservice.deleteBlkQR(bloque.id_block).subscribe(response=>{
        for(let i=0;i<bloque.linksAPI.length;i++)
          this.linksAPIService.deleteLinksAPI(bloque.linksAPI[i].id_link).subscribe(response=>{});
        for(let i=0;i<bloque.linksAPI.length;i++)
          this.credencialAPIService.deleteCredencialAPI(bloque.credenciales[i].id_credencial).subscribe(response=>{});
        this.deleteBlkArry(bloque, index);
      });
    }
    
  }

  deleteBlkArry(bloque: any, index: number){
    if(((bloque.blocktype=='informativo' || bloque.blocktype=='input' || bloque.blocktype=='informativoDinamico' || bloque.blocktype=='slideDinamico' || bloque.blocktype=='inputDinamico' || bloque.blocktype=='quickReplyDinamico') && bloque.opc_nextid== 'Seleccionar de la lista') || (bloque.blocktype=='slide' && bloque.opc_elm=='Una sola transición' && bloque.opc_nextid== 'Seleccionar de la lista')){
      if(bloque.opc_nextid=='Seleccionar de la lista')
        for(let i=0;i<this.globals.AllBlocks.length;i++)
          for(let j=0;j<this.globals.AllBlocks[i].length;j++)
            if(bloque.next_id==this.globals.AllBlocks[i][j].namestate){
              for(let y=0;y<this.globals.AllBlocks[i][j].tags_entradas.length;y++)
                if(this.globals.AllBlocks[i][j].tags_entradas[y]==bloque.namestate){
                  this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
                  return;
                }
                               
                 
            }
    }
    else if(bloque.blocktype=='slide' && bloque.opc_elm=='Una transición por elemento'){
      for(let elm=0;elm<bloque.elementos.length;elm++)
        for(let cont_btn=0;cont_btn<bloque.elementos[elm].botones.length;cont_btn++)
          if(bloque.elementos[elm].botones[cont_btn].opc_nextid == "Seleccionar de la lista")
            for(let i=0;i<this.globals.AllBlocks.length;i++)
              for(let j=0;j<this.globals.AllBlocks[i].length;j++)
                if(bloque.elementos[elm].botones[cont_btn].contentbutton == this.globals.AllBlocks[i][j].namestate){
                  for(let y=0;y<this.globals.AllBlocks[i][j].tags_entradas.length;y++)
                    if(this.globals.AllBlocks[i][j].tags_entradas[y] == (bloque.namestate+" -> "+bloque.elementos[elm].title+" -> "+bloque.elementos[elm].botones[cont_btn].titlebutton)){
                      this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
                      break;
                    }
                  break;   
                }
    }
    else if(bloque.blocktype=='slide'){
      if(bloque.opc_nextid == 'Seleccionar de la lista'){
        for(let i=0;i<this.globals.AllBlocks.length;i++)
          for(let j=0;j<this.globals.AllBlocks[i].length;j++)
            if(bloque.next_id==this.globals.AllBlocks[i][j].namestate){
              for(let y=0;y<this.globals.AllBlocks[i][j].tags_entradas.length;y++)
                if(this.globals.AllBlocks[i][j].tags_entradas[y]==bloque.namestate){
                  this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
                  break;
                }
            }
      }
    }
    else if(bloque.blocktype=='internalProcess'){
      if(bloque.opc_nextid == 'Seleccionar de la lista'){
        for(let i=0;i<this.globals.AllBlocks.length;i++)
          for(let j=0;j<this.globals.AllBlocks[i].length;j++)
            if(bloque.default_nextid==this.globals.AllBlocks[i][j].namestate){
              for(let y=0;y<this.globals.AllBlocks[i][j].tags_entradas.length;y++)
                if(this.globals.AllBlocks[i][j].tags_entradas[y]==bloque.namestate){
                  this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
                  break;
                }
            }
      }
    }

    for(let i=0;i<this.globals.AllBlocks[index].length;i++){
      if(bloque.namestate==this.globals.AllBlocks[index][i].namestate){
        this.globals.AllBlocks[index].splice(i, 1);
      }
    }
    while(true)
      if(this.globals.AllBlocks.length>1)
        if (this.globals.AllBlocks[this.globals.AllBlocks.length-1].length==0)
          if(this.globals.AllBlocks[this.globals.AllBlocks.length-2].length==0)
            this.globals.AllBlocks.pop();          
          else
            break;        
        else{
          this.globals.AllBlocks.push([]);
          break;
        }
      else
        break;
  }  

  drop(event: CdkDragDrop<string[]>) {
    /*console.log("event.previousContainer-> "+event.previousContainer);
    console.log("event.container.data-> "+event.container.data);
    console.log("event.container-> "+event.container);
    console.log("event.currentIndex-> "+event.currentIndex);
    console.log("event.previousContainer.data-> "+event.previousContainer.data);*/
    if (event.previousContainer === event.container) {
      /*console.log("SE MOVIO UN BLOQUE");
      console.log("Datos:");
      console.log("event.container.data: "+event.container.data);
      console.log("event.previousIndex: "+event.previousIndex);
      console.log("event.currentIndex: "+event.currentIndex);*/
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);      

    } else {
      /*console.log("SE TRANSFIRIO UN BLOQUE");
      console.log("Datos:");
      console.log("event.container.data: "+event.container.data);
      console.log("event.previousIndex: "+event.previousIndex);
      console.log("event.currentIndex: "+event.currentIndex);*/
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }

    while(true)
      if (this.globals.AllBlocks[this.globals.AllBlocks.length-1].length==0){
        if(this.globals.AllBlocks[this.globals.AllBlocks.length-2].length==0){
          this.globals.AllBlocks.pop();
        }
        else
          break;
      }
      else{
        this.globals.AllBlocks.push([]);
        break;
      }
      
      this.globals.generar_Id();

       
  }

  

  addFila(index: number){
    this.globals.AllBlocks.splice((index),0,[]);
    this.globals.generar_Id();
  }

  deleteFila(index: number){
    if(this.globals.AllBlocks[index].length==0){
      this.globals.AllBlocks.splice((index),1);
      this.globals.generar_Id();
    }      
  }


}
