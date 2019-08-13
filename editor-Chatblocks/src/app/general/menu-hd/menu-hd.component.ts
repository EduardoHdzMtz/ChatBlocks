import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FromSaveCBComponent } from '../bloques/from-save-cb/from-save-cb.component';
import {MatToolbarModule} from '@angular/material/toolbar'

import {Globals} from '../bloques/interfaces/Globals';
import { AuthService } from 'angularx-social-login';
import { BlkInputService } from 'src/app/sendToDB/blkInput.service';
import { BlkInfoService } from 'src/app/sendToDB/blkInfo.service';
import { BlkQRService } from 'src/app/sendToDB/blkQR.service';
import { BlkSlideService } from 'src/app/sendToDB/blkSlide.service';

@Component({
  selector: 'app-menu-hd',
  templateUrl: './menu-hd.component.html',
  styleUrls: ['./menu-hd.component.css']
})
export class MenuHDComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private blokInputservice: BlkInputService, 
    private blokInfoservice: BlkInfoService,
    private blokQRservice: BlkQRService,
    private blokSlideservice: BlkSlideService,
    public globals: Globals, 
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

  signOut(): void {
    this.authService.signOut();
  }

  guardarChatBot(){
    const modal=this.modalService.open(FromSaveCBComponent)
    modal.result.then(
      this.handleModalFromChatBotClose.bind(this),
      this.handleModalFromChatBotClose.bind(this)
    )    
    modal.componentInstance.createMode = false;
    modal.componentInstance.bot = this.globals.RobotSelect;
  }

  handleModalFromChatBotClose(){
    //this.globals.estado='in';
  }

  cancelarEdicion() { 
    this.blokInfoservice.deleteBlkInfoBot(this.globals.RobotSelect.id_robot).subscribe(response=>{});
    
    this.blokInputservice.deleteBlkInputBot(this.globals.RobotSelect.id_robot).subscribe(response=>{});
    
    this.blokQRservice.deleteBlkQRBot(this.globals.RobotSelect.id_robot).subscribe(response=>{});
    
    this.blokSlideservice.deleteBlkSlideBot(this.globals.RobotSelect.id_robot).subscribe(response=>{
      this.restablecerChatbot();
    });    
  }

  restablecerChatbot(){
    for(let i=0;i<this.globals.PenultimaEdBlks.length;i++){
      for(let j=0;j<this.globals.PenultimaEdBlks[i].length;j++){
        if(this.globals.PenultimaEdBlks[i][j].blocktype=='informativo')
          this.blokInfoservice.updateBlkInfo(this.globals.AllBlocks[i][j]).subscribe(response=>{});
        else if(this.globals.PenultimaEdBlks[i][j].blocktype=='input')
          this.blokInputservice.updateBlkInput(this.globals.AllBlocks[i][j]).subscribe(response=>{});
        else if(this.globals.PenultimaEdBlks[i][j].blocktype=='quickReply')
          this.blokQRservice.updateBlkQR(this.globals.AllBlocks[i][j]).subscribe(response=>{});
      }
    }  

    this.globals.estado='in';
    
  }

}
