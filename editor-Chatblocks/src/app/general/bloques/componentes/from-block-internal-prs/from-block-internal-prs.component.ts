import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntefazInternalProcess } from '../../interfaces/interfaz-view-blk-info';
import { ElementoService } from 'src/app/sendToDB/elementos.service';
import { Globals } from '../../interfaces/Globals';

@Component({
  selector: 'app-from-block-internal-prs',
  templateUrl: './from-block-internal-prs.component.html',
  styleUrls: ['./from-block-internal-prs.component.css']
})
export class FromBlockInternalPrsComponent implements OnInit {

  from_InternalProcess: FormGroup;
  createMode: boolean=true;
  Internal_Process: IntefazInternalProcess[];
  states: string[]=[];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal,
    private elementoService: ElementoService, 
    public globals: Globals
  ) { }

  ngOnInit() {
    this.from_InternalProcess=this.formBuilder.group({
      operation: [''],
      data_opt: ['']
    });

    this.Internal_Process=[];

    if (!this.createMode) {
      this.loadBloque(this.Internal_Process); 
    }
  }

  loadBloque(Internal_Process){
    //this.fromElementos.patchValue(elemento);
    let elemento_copia: any[];

    for(let cont_IP=0;cont_IP<Internal_Process.length;cont_IP++){    
      elemento_copia[cont_IP]={
        operation: Internal_Process[cont_IP].operation,
        data_opt: Internal_Process[cont_IP].data_opt
      }
    }

    this.from_InternalProcess.patchValue(elemento_copia);
  }

  save_InternalProcess(){

  }

  add_InternalProcess(){
    
  }

}
