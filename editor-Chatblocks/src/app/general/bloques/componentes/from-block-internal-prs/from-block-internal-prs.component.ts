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

  from_Selector: FormGroup;
  from_InternalProcess: FormGroup[]=[];
  createMode: boolean=true;
  Internal_Process: any[];
  states: string[]=[];
  numeracion: number[]=[];
  num_datos_Suma: number= 3;
  num_datos_if: number=3;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal,
    private elementoService: ElementoService, 
    public globals: Globals
  ) { }

  ngOnInit() {
    /*
      opc_InernalProcess
      nom_var
      opc_data
      nom_var
      data_num
    */
   this.from_Selector=this.formBuilder.group({
      opc_InernalProcess: ['']
    });

    for(let num=1;num<=100;num++)
      this.numeracion.push(num);

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
        data_opt: Internal_Process[cont_IP].data_opt,
      }
    }

    
  }

  save_InternalProcess(){
  }

  add_InternalProcess(){
  }

  agregarOperacion(type_InternalProcces: string){
    let tam = this.Internal_Process.length;
    if(type_InternalProcces == 'Matt')
      this.datos_Matt(tam);
    else if(type_InternalProcces == 'if')
      this.datos_if(tam);
    
  }

  datos_Matt(posicion: number){
    let formato_Matt: any={
      id_block: '',
      order: posicion,
      type_operation: 'Matt',
      opc_type_1: '',
      opc_data_1: '',
      data_1: '',
      opc_operation: '',
      opc_type_2: '',
      opc_data_2: '',
      data_2:''
    }

    let form_Matt: FormGroup= this.formBuilder.group({
      opc_type_1: [''],
      opc_data_1: [''],
      data_1: [''],
      opc_operation: [''],
      opc_type_2: [''],
      opc_data_2: [''],
      data_2:['']
    });

    this.Internal_Process.push(formato_Matt);
    this.from_InternalProcess.push(form_Matt);
  }

  datos_if(posicion: number){
    let formato_if: any={
      id_block: '',
      order: posicion,
      type_operation: 'if',
      opc_type_1: '',
      opc_data_1: '',
      dato_1: '',
      opc_compare: '',
      opc_type_2: [''],
      opc_data_2: [''],
      data_2:['']
    }

    let form_if: FormGroup= this.formBuilder.group({
      opc_type_1: [''],
      opc_data_1: [''],
      data_1: [''],
      opc_compare: [''],
      opc_type_2: [''],
      opc_data_2: [''],
      data_2:['']
    });

    this.Internal_Process.push(formato_if);
    this.from_InternalProcess.push(form_if);
  }


  eliminarOperacion(index: number){
    this.Internal_Process.splice(index, 1);
    this.from_InternalProcess.splice(index, 1);
  }

  

}
