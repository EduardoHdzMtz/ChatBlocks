import { Component, OnInit, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FromBlockInfoComponent } from '../bloques/from-block-info/from-block-info.component';
import { FromBlockInputComponent } from '../bloques/from-block-input/from-block-input.component';
import { FromBlockQRComponent } from '../bloques/from-block-qr/from-block-qr.component';
import { FromBlockSlideComponent } from '../bloques/from-block-slide/from-block-slide.component';

import { InterfazViewBlkInfo } from '../bloques/interfaces/interfaz-view-blk-info';
import { FromBlockInfoDComponent } from '../bloques/from-block-info-d/from-block-info-d.component';
import { FromBlockSlideDComponent } from '../bloques/from-block-slide-d/from-block-slide-d.component';
import { FromBlockInputDComponent } from '../bloques/from-block-input-d/from-block-input-d.component';
import { FromBlockQRDComponent } from '../bloques/from-block-qrd/from-block-qrd.component';


@Component({
  selector: 'app-menu-herramientas',
  templateUrl: './menu-herramientas.component.html',
  styleUrls: ['./menu-herramientas.component.css']
})
export class MenuHerramientasComponent implements OnInit {

  todoBlkInfo: InterfazViewBlkInfo[] = [];
  tam: any[]=[0,0];

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    if (typeof window.innerWidth != 'undefined'){
      this.tam = [window.innerWidth,window.innerHeight];
      //console.log("Caso 1-> Ancho: "+this.tam[0]+", largo: "+this.tam[1]);
    }
    else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0)
    {
      this.tam = [
          document.documentElement.clientWidth,
          document.documentElement.clientHeight
      ];
      alert("Caso 2-> Ancho: "+this.tam[0]+", largo: "+this.tam[1]);
    }

    let shand = document.getElementsByClassName("ContenedorTools") as HTMLCollectionOf<HTMLElement>;
    let tam= this.tam[1]-70-38;
    shand[0].setAttribute("style", "height: "+tam+"px;");
  }

  addBlockInfo(){
    const modal=this.modalService.open(FromBlockInfoComponent)
    modal.result.then(
      this.handleModalFromBlockInfoClose.bind(this),
      this.handleModalFromBlockInfoClose.bind(this)
    )
    
  }

  handleModalFromBlockInfoClose(response){
  }

  addBlockInput(){
    const modal=this.modalService.open(FromBlockInputComponent)
    modal.result.then(
      this.handleModalFromBlockInputClose.bind(this),
      this.handleModalFromBlockInputClose.bind(this)
    )
  }

  handleModalFromBlockInputClose(){
  }

  addBlockQR(){
    const modal=this.modalService.open(FromBlockQRComponent)
    modal.result.then(
      this.handleModalFromBlockQRClose.bind(this),
      this.handleModalFromBlockQRClose.bind(this)
    )
  }

  handleModalFromBlockQRClose(){
  }

  addBlockSlide(){
    const modal=this.modalService.open(FromBlockSlideComponent)
    modal.result.then(
      this.handleModalFromBlockSlideClose.bind(this),
      this.handleModalFromBlockSlideClose.bind(this)
    )
  }

  handleModalFromBlockSlideClose(){
  }

  addBlockTicket(){}
  addBlockSlideBuy(){}

  addBlockInfoD(){
    const modal=this.modalService.open(FromBlockInfoDComponent)
    modal.result.then(
      this.handleModalFromBlockSlideClose.bind(this),
      this.handleModalFromBlockSlideClose.bind(this)
    )
  }

  addBlockInputD(){
    const modal=this.modalService.open(FromBlockInputDComponent)
    modal.result.then(
      this.handleModalFromBlockSlideClose.bind(this),
      this.handleModalFromBlockSlideClose.bind(this)
    )

  }

  addBlockQRD(){
    const modal=this.modalService.open(FromBlockQRDComponent)
    modal.result.then(
      this.handleModalFromBlockSlideClose.bind(this),
      this.handleModalFromBlockSlideClose.bind(this)
    )
  }

  addBlockSlideD(){
    const modal=this.modalService.open(FromBlockSlideDComponent)
    modal.result.then(
      this.handleModalFromBlockSlideClose.bind(this),
      this.handleModalFromBlockSlideClose.bind(this)
    )
  }

}
