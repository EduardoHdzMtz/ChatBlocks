import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfazChatBot } from '../interfaces/interfaz-view-blk-info';
import { ChatbotService } from '../../../sendToDB/ChatBot.service';
import { BlkInfoService } from '../../../sendToDB/blkInfo.service';
import { BlkInputService } from 'src/app/sendToDB/blkInput.service';
import { BlkQRService } from 'src/app/sendToDB/blkQR.service';
import { Globals } from '../interfaces/Globals';
import { BlkSlideService } from 'src/app/sendToDB/blkSlide.service';
import { BlkInfoServiceDin } from 'src/app/sendToDB/blkInfoDin.service';
import { BlkSlideServiceDin } from 'src/app/sendToDB/blkSlideDin.service';
import { BlkInputServiceDin } from 'src/app/sendToDB/blkIputDin.service';
import { BlkQRServiceDin } from 'src/app/sendToDB/blkQRDin.service';
import { ElementoService } from 'src/app/sendToDB/elementos.service';
import { BotonesService } from 'src/app/sendToDB/botones.service';
import { BlkInternalPrs } from 'src/app/sendToDB/blkInternalPrs.service';
import { OperacionesService } from 'src/app/sendToDB/operaciones.service';
import { variablesService } from 'src/app/sendToDB/variables.service';

@Component({
  selector: 'app-from-save-cb',
  templateUrl: './from-save-cb.component.html',
  styleUrls: ['./from-save-cb.component.css']
})
export class FromSaveCBComponent implements OnInit {

  fromChatBot: FormGroup;
  createMode: boolean=true;
  bot: InterfazChatBot;
  states: string[]=[];

  constructor(private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal, 
    private botService: ChatbotService,
    private blkInfoService: BlkInfoService,
    private blkInputService: BlkInputService,
    private blkQRService: BlkQRService,
    private blkQRDService: BlkQRServiceDin,
    private blkSlideService: BlkSlideService,
    private blkInfoDService: BlkInfoServiceDin,
    private blkSlideDService: BlkSlideServiceDin,
    private blkInputDService: BlkInputServiceDin,
    private elementoService: ElementoService,
    private botonesService: BotonesService,
    private blkInternalPrsService: BlkInternalPrs,
    private opcService: OperacionesService,
    private varService: variablesService,
    public globals: Globals
    ) { }

  ngOnInit() {

    this.fromChatBot=this.formBuilder.group({
      name_robot: ['', Validators.required],
      id_face: [''],
      access_token: [''],
      api_nlp: ['']
    });

    if (!this.createMode) {
      this.loadBloque(this.bot); 
    }
  }

  loadBloque(bot){
    this.fromChatBot.patchValue(bot);
  }
  

  saveChatBot() {
    if (this.fromChatBot.invalid) {
      return;
    }
    
    if (this.createMode){
      

      let datosBot: InterfazChatBot = this.fromChatBot.value;
      datosBot.id_robot='';
      datosBot.block_ini='';
      datosBot.type_blocki='';
      datosBot.id_user=this.globals.user.email;
      //todo.updateAt = new Date();
      this.botService.addDatosBot(datosBot).subscribe(response =>{
        const datos='{"id_user": "'+datosBot.id_user+'", "name_robot": "'+datosBot.name_robot+'"}';
        this.botService.getBot(datos).subscribe(response=> {
          if(this.globals.AllChatBots[this.globals.AllChatBots.length-1].length<4)
            this.globals.AllChatBots[this.globals.AllChatBots.length-1].push(response[0]);
          else
            this.globals.AllChatBots.push([response[0]]);   
          this.globals.RobotSelect=response[0];
          //this.globals.id_robot=response[0].id_robot;
          this.globals.estado='interfaz';
          this.handleSuccessfulSaveTodo(datosBot);
        });
      });
    } else{
      this.saveAllBloks();
      

      let datosBot: InterfazChatBot = this.fromChatBot.value;    
      datosBot.id_robot=this.bot.id_robot;
      datosBot.block_ini=this.globals.AllBlocks[0][0].namestate;
      datosBot.type_blocki=this.globals.AllBlocks[0][0].blocktype;
      datosBot.id_user=this.globals.user.email;
      //todo.updateAt = new Date();
      this.botService.updateBot(datosBot).subscribe(response=>{
        for(let i=0;i<this.globals.AllChatBots.length;i++)
          for(let j=0;j<this.globals.AllChatBots[i].length;j++)
            if(this.globals.AllChatBots[i][j].id_robot==datosBot.id_robot && this.globals.AllChatBots[i][j].name_robot==datosBot.name_robot)
              this.globals.AllChatBots[i][j]=datosBot;
        this.globals.AllBlocks=[];
        this.globals.estado='in';
      });
      this.handleSuccessfulEditTodo(datosBot);
        //.catch(err => console.error(err));
    }
  }

  saveAllBloks(){
    let id_vars: any[]=[];
    for(let i=0;i<(this.globals.AllBlocks.length-1);i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        if(this.globals.AllBlocks[i][j].blocktype=='informativo')
          this.blkInfoService.updateBlkInfo(this.globals.AllBlocks[i][j]).subscribe(response=>{});
        else if(this.globals.AllBlocks[i][j].blocktype=='input'){
          this.blkInputService.updateBlkInput(this.globals.AllBlocks[i][j]).subscribe(response=>{});
          id_vars.push(this.globals.AllBlocks[i][j].id_var);
        }
        else if(this.globals.AllBlocks[i][j].blocktype=='quickReply'){
          this.blkQRService.updateBlkQR(this.globals.AllBlocks[i][j]).subscribe(response=>{});
          console.log("QR-> "+this.globals.AllBlocks[i][j].id_var);
          id_vars.push(this.globals.AllBlocks[i][j].id_var);
        }
        else if(this.globals.AllBlocks[i][j].blocktype=='slide'){
          this.actualizar_Slide(i,j);
          this.blkSlideService.updateBlkSlide(this.globals.AllBlocks[i][j]).subscribe(response=>{});
          id_vars.push(this.globals.AllBlocks[i][j].id_var);
          for(let cont_elm=0;cont_elm<this.globals.AllBlocks[i][j].elementos.length;cont_elm++){
            this.elementoService.updateElementos(this.globals.AllBlocks[i][j].elementos[cont_elm]).subscribe(response=>{});
            for(let cont_btn=0;cont_btn<this.globals.AllBlocks[i][j].elementos[cont_elm].botones.length;cont_btn++)
              this.botonesService.updateBoton(this.globals.AllBlocks[i][j].elementos[cont_elm].botones[cont_btn]).subscribe(response=> {});
          }
        }
        else if(this.globals.AllBlocks[i][j].blocktype=='internalProcess'){
          this.blkInternalPrsService.updateBlkInternalPrs(this.globals.AllBlocks[i][j]).subscribe(response=>{});
          for(let cont_opc=0;cont_opc<this.globals.AllBlocks[i][j].operaciones.length;cont_opc++){
            this.opcService.updateOpc(this.globals.AllBlocks[i][j].operaciones[cont_opc]).subscribe(response=>{});   
            if(this.globals.AllBlocks[i][j].operaciones[cont_opc].type_operation != 'else'){
              id_vars.push(this.globals.AllBlocks[i][j].operaciones[cont_opc].id_var_1);  
              id_vars.push(this.globals.AllBlocks[i][j].operaciones[cont_opc].id_var_2);  
            }      
          }
        }
        else if(this.globals.AllBlocks[i][j].blocktype=='informativoDinamico')
          this.blkInfoDService.updateBlkInfo(this.globals.AllBlocks[i][j]).subscribe(response=>{});
        else if(this.globals.AllBlocks[i][j].blocktype=='slideDinamico'){
          this.blkSlideDService.updateBlkSlide(this.globals.AllBlocks[i][j]).subscribe(response=>{});
          id_vars.push(this.globals.AllBlocks[i][j].id_var);
        }
        else if(this.globals.AllBlocks[i][j].blocktype=='inputDinamico'){
          this.blkInputDService.updateBlkInput(this.globals.AllBlocks[i][j]).subscribe(response=>{});
          id_vars.push(this.globals.AllBlocks[i][j].id_var);
        }
        else if(this.globals.AllBlocks[i][j].blocktype=='quickReplyDinamico'){
          this.blkQRDService.updateBlkQR(this.globals.AllBlocks[i][j]).subscribe(response=>{});
          id_vars.push(this.globals.AllBlocks[i][j].id_var);
        }
      }
    }  
    let buscador=0;
    for(let cont_vars=0; cont_vars<this.globals.tabla_vars.length; cont_vars++){
      buscador=0;
      for(let cont_vars_ext=0; cont_vars_ext<id_vars.length; cont_vars_ext++){
        if(id_vars[cont_vars_ext] == this.globals.tabla_vars[cont_vars].id_var){          
          buscador=1;
          break;
        }
      }
      if(buscador == 0)
        this.varService.deleteVar(this.globals.tabla_vars[cont_vars].id_var).subscribe(responce=>{});
    }
    
  }

  actualizar_listaVars(){
    
  }

  actualizar_Slide(fila: number, columna: number){
    let cadNI: string='';

    if(this.globals.AllBlocks[fila][columna].opc_elm == 'Una transición por elemento'){
      cadNI=this.globals.AllBlocks[fila][columna].elementos[0].botones[0].contentbutton;        
        
      if(this.globals.AllBlocks[fila][columna].elementos[0].botones.length == 2)
        if(this.globals.AllBlocks[fila][columna].elementos[0].botones[1].typebutton == 'postback')
          cadNI=cadNI+','+this.globals.AllBlocks[fila][columna].elementos[0].botones[1].contentbutton;
      
      for(let i=1;i<this.globals.AllBlocks[fila][columna].elementos.length;i++)
        for(let cont_btn=0;cont_btn<this.globals.AllBlocks[fila][columna].elementos[i].botones.length;cont_btn++){
          if(this.globals.AllBlocks[fila][columna].elementos[i].botones[cont_btn].typebutton == 'postback')
            cadNI=cadNI+','+this.globals.AllBlocks[fila][columna].elementos[i].botones[cont_btn].contentbutton;
        }
      
      this.globals.AllBlocks[fila][columna].next_id=cadNI; 
    }
  }


  handleSuccessfulSaveTodo(datos: InterfazChatBot) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_robot, createMode: true });
  }

  handleSuccessfulEditTodo(datos: InterfazChatBot) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_robot, createMode: false });
  }


}

