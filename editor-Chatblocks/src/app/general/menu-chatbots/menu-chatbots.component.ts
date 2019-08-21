import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FromSaveCBComponent } from '../bloques/from-save-cb/from-save-cb.component';
import { Globals } from '../bloques/interfaces/Globals';
import { ChatbotService } from '../../sendToDB/ChatBot.service';
import { BlkInfoService } from '../../sendToDB/blkInfo.service';
import { BlkInputService } from '../../sendToDB/blkInput.service';
import { BlkQRService } from '../../sendToDB/blkQR.service';
import { BlkSlideService } from '../../sendToDB/blkSlide.service';
import { ALLOW_MULTIPLE_PLATFORMS } from '@angular/core/src/application_ref';
import { concat } from 'rxjs';
import { BlkInfoServiceDin } from 'src/app/sendToDB/blkInfoDin.service';

@Component({
  selector: 'app-menu-chatbots',
  templateUrl: './menu-chatbots.component.html',
  styleUrls: ['./menu-chatbots.component.css']
})
export class MenuChatbotsComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private blokInputservice: BlkInputService, 
    private blokInfoservice: BlkInfoService,
    private blokInfoDService: BlkInfoServiceDin, 
    private blokQRservice: BlkQRService,
    private blokSlideservice: BlkSlideService,
    public globals: Globals, 
    private robotService: ChatbotService
    ) { }

  ngOnInit() {
    this.loadTodosChatbots();
  }
  

  loadTodosChatbots() {
    this.robotService.getAll_ByUser(this.globals.user.email).subscribe(response=> {
      this.globals.AllChatBots=[];
      let ChatbotsList: any[]=[];
      ChatbotsList=response;
      for(let j=0; j<ChatbotsList.length;j++)
          console.log("Chatbot J: "+j+" -> "+ChatbotsList[j].name_robot);
      this.globals.AllChatBots.push([]);
      console.log("Tam allCB:"+this.globals.AllChatBots.length);
      console.log("Tam allCBIn:"+this.globals.AllChatBots[0].length);
      console.log("Tam ChatbotsList:"+ChatbotsList.length);
      let cont=0;
      for(let i=1; i<=ChatbotsList.length; i++){
        this.globals.AllChatBots[cont].push(ChatbotsList[i-1]);
        if((i%4)==0){
          this.globals.AllChatBots.push([]);  
          cont++;
        }
              
      }

      console.log("Tam allCB:"+this.globals.AllChatBots.length);
      console.log("Tam allCBIn:"+this.globals.AllChatBots[0].length);
      console.log("Tam ChatbotsList:"+ChatbotsList.length);
      
      for(let i=0; i<this.globals.AllChatBots.length;i++)
        for(let j=0; j<this.globals.AllChatBots[i].length;j++)
          console.log("Chatbot "+i+", "+j+" -> "+this.globals.AllChatBots[i][j].name_robot);
    });
  }


  addChatbot(){
    const modal=this.modalService.open(FromSaveCBComponent)
    modal.result.then(
      this.handleModalFromChatBotClose.bind(this),
      this.handleModalFromChatBotClose.bind(this)
    )

  }

  handleModalFromChatBotClose(){
  }

  eliminarChatbot(robot: any, index: number){
    console.log("Index-> "+index);
    console.log("Tam ini-> "+this.globals.AllChatBots.length);
    this.DeleteBLKS(robot);
    this.robotService.deleteBot(robot.id_robot).subscribe(response=>{

      for(let i=0;i<this.globals.AllChatBots[index].length;i++){
        if(robot.id_robot==this.globals.AllChatBots[index][i].id_robot){
          this.globals.AllChatBots[index].splice(i, 1);
          
          this.loadTodosChatbots();
        }
      }
    });
  }

  DeleteBLKS(bot: any) { 
    this.blokInfoservice.deleteBlkInfoBot(bot.id_robot).subscribe(response=>{});
    
    this.blokInputservice.deleteBlkInputBot(bot.id_robot).subscribe(response=>{});
    
    this.blokQRservice.deleteBlkQRBot(bot.id_robot).subscribe(response=>{});
    
    this.blokSlideservice.deleteBlkSlideBot(bot.id_robot).subscribe(response=>{});    

    this.blokInfoDService.deleteBlkInfoBot(bot.id_robot).subscribe(response=>{}); 
  }

  recorrerRobots(i: number){
    console.log("IndexInto->"+i);
    for(let i=0; i<this.globals.AllChatBots.length;i++)
        for(let j=0; j<this.globals.AllChatBots[i].length;j++)
          console.log("Antes-Chatbot "+i+", "+j+" -> "+this.globals.AllChatBots[i][j].name_robot);


    //if(this.globals.AllChatBots.length-1>2){
      for(let y=i;y<(this.globals.AllChatBots.length-1);y++){
        console.log("Tam: "+this.globals.AllChatBots.length+", i: "+i+", y: "+y)
        this.globals.AllChatBots[y].push(this.globals.AllChatBots[y+1][0]);
        this.globals.AllChatBots[y+1].splice(0, 1);
      }
    //}

    for(let i=0; i<this.globals.AllChatBots.length;i++)
        for(let j=0; j<this.globals.AllChatBots[i].length;j++)
          console.log("Despues-Chatbot "+i+", "+j+" -> "+this.globals.AllChatBots[i][j].name_robot);
  }

  editarChatbot(robot: any, index: number){
    this.globals.RobotSelect=robot
    this.globals.estado='editar';
  }

}
