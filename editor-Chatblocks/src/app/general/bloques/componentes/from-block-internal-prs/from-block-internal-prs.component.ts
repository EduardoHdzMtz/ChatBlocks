import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntefazInternalProcess, IntefazOperaciones, InterfazVariables } from '../../interfaces/interfaz-view-blk-info';
import { BlkInternalPrs } from 'src/app/sendToDB/blkInternalPrs.service';
import { OperacionesService } from 'src/app/sendToDB/operaciones.service';
import { variablesService } from 'src/app/sendToDB/variables.service';
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
  list_cad: string[];
  list_num: string[];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal,
    private blkInternalPrsService: BlkInternalPrs,
    private opcService: OperacionesService,
    private varService: variablesService, 
    public globals: Globals
  ) { }

  ngOnInit() {
    for(let i=0;i<this.globals.AllBlocks.length;i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        this.states.push(this.globals.AllBlocks[i][j].namestate);
      }
    }

    this.cargar_var();

    this.from_Selector=this.formBuilder.group({
      namestate: [''],
      default_id: [''],
      opc_InernalProcess: ['']
    });

    for(let num=1;num<=100;num++)
      this.numeracion.push(num);

    this.Internal_Process=[];

    if (!this.createMode) {
      this.loadBloque(this.Internal_Process); 
    }
  }

  cargar_var(){
    this.list_cad=[];
    this.list_num=[];

    for(let fil=0;fil<this.globals.AllBlocks.length;fil++)
      for(let col=0;col<this.globals.AllBlocks[fil].length;col++)
        if(this.globals.AllBlocks[fil][col].blocktype == 'input' || this.globals.AllBlocks[fil][col].blocktype == 'quickReply' || this.globals.AllBlocks[fil][col].blocktype == 'slide' || this.globals.AllBlocks[fil][col].blocktype == 'informativoDinamico' || this.globals.AllBlocks[fil][col].blocktype == 'inputDinamico' || this.globals.AllBlocks[fil][col].blocktype == 'quickReplyDinamico' || this.globals.AllBlocks[fil][col].blocktype == 'slideDinamico'){
          this.list_cad.push(this.globals.AllBlocks[fil][col].save_var);
        }

  }

  lista_variables(){
    

    /*this.varService.getAll_ByRobot(this.globals.RobotSelect.id_robot).subscribe(response =>{
      for(let cont_v;cont_v<response.length;cont_v++){
        if(response[cont_v].type_data == 'Cadena')
          this.lista_var_string.push(response[cont_v]);
        else
          this.lista_var_number.push(response[cont_v]);
      }
      
    });*/
    

    //this.lista_var_string.push('cadena');
    //this.lista_var_number.push(response[cont_v]);

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
    if (this.from_InternalProcess[0].invalid) {
      return;
    }
    
    if (this.createMode){
      
      let datosBloque: IntefazInternalProcess = this.from_Selector.value;
      datosBloque.id_block = 'sin almacenar';
      datosBloque.id_robot=this.globals.RobotSelect.id_robot;
      datosBloque.blocktype='internalProcesss';
      datosBloque.pos_x=0;
      datosBloque.pos_y=this.globals.AllBlocks.length-1;
      datosBloque.operaciones=[];
      datosBloque.tags_entradas=[];

      this.blkInternalPrsService.addDatosBlkInternalPrs(datosBloque).subscribe(response =>{
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        this.blkInternalPrsService.getBlk(datos).subscribe(response=> {
          datosBloque.id_block=response[0].id_block;
          datosBloque.operaciones= this.Internal_Process;
          datosBloque.tags_entradas=[];  
          this.globals.AllBlocks.pop();
          this.globals.AllBlocks.push([datosBloque]);
          this.globals.AllBlocks.push([]);
          

          for(let cont_opc=0;cont_opc<this.from_InternalProcess.length;cont_opc){
            this.generar_datos_operaciones(cont_opc, this.globals.AllBlocks[this.globals.AllBlocks.length-2][0]);
          }
          
          let result= this.globals.generar_Id();
          
          //this.crear_tag(datosBloque.next_id, datosBloque.namestate);
          this.handleSuccessfulSaveTodo(datosBloque);
        });
      });        
      
    } else{
      /*let datosBloque: InterfazViewBlkInfo = this.fromBlksInfo.value;
      datosBloque.id_block = this.bloque.id_block;      
      datosBloque.id_robot=this.bloque.id_robot;
      datosBloque.blocktype='informativo';
      datosBloque.contenttype='text';
      datosBloque.pos_x=this.bloque.pos_x;
      datosBloque.pos_y=this.bloque.pos_y;
      datosBloque.tags_entradas=this.bloque.tags_entradas;
      //todo.updateAt = new Date();    
      
      this.blkInfoService.updateBlkInfo(datosBloque).subscribe(response=>{
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
      this.handleSuccessfulEditTodo(datosBloque);*/
        //.catch(err => console.error(err));
    }
  }

  generar_datos_operaciones(cont_opc: number, datos_Bloque: any){
    let opc_save: any = this.operaciones_almacenar(cont_opc, datos_Bloque.id_block);

    this.opcService.addDatosOpc(opc_save).subscribe(response =>{
      const datos='{"id_block": "'+opc_save.id_block+'", "namestate": "'+opc_save.order_opc+'"}';
      this.opcService.getOpc_data(datos).subscribe(responseOpc=> {
        opc_save.id_operacion = responseOpc[0].id_operacion;

        this.Internal_Process[cont_opc]=opc_save;

        this.Internal_Process[cont_opc].id_var_1 = this.almacenar_variable(cont_opc, 0, opc_save.id_operacion);
        this.Internal_Process[cont_opc].id_var_2 = this.almacenar_variable(cont_opc, 1, opc_save.id_operacion);

        datos_Bloque.operaciones=this.Internal_Process[cont_opc];
      });
    });

  }

  almacenar_variable(cont_opc: number, cont_var: number, id_operacion){
    this.Internal_Process[cont_opc].variables[cont_var] = this.from_InternalProcess.values;
    this.Internal_Process[cont_opc].variables[cont_var].id_operacion = id_operacion;
    
    this.varService.addDatosVar(this.Internal_Process[cont_opc].variables[cont_var]).subscribe(response=> {
      const datos='{"id_operacion": "'+id_operacion+'", "namestate": "'+this.Internal_Process[cont_opc].variables[cont_var].var+'"}';
        this.varService.getVar_data(datos).subscribe(responseVar=> {
          this.Internal_Process[cont_opc].variables[cont_var].id_var = responseVar[0].id_var;          
          return responseVar[0].id_var;
        });
    });

  }

  operaciones_almacenar(cont_opc, id_block){
    let formato_Opc: any={
      id_operacion: '',
      id_block: id_block,
      order_opc: cont_opc,
      type_operation: '',
      new_exist: '',
      id_var_1: '',
      opc_operation: '',
      id_var_2: '',
    }

    return formato_Opc=this.from_InternalProcess[cont_opc].value;
  }

  guardar_operaciones(cont_opc: number, datos_Bloque: any){
    let datosBloque: IntefazInternalProcess
    //this.opcService.addDatosOpc()

  }

  add_InternalProcess(){
  }

  agregarOperacion(type_InternalProcces: string){
    console.log("Agregando Operacion 1");
    let tam = this.Internal_Process.length;

    if(tam > 0){  
      if(this.actualizar_variables(tam-1))
        this.selector_tipo(type_InternalProcces, tam);
    }
    else
      this.selector_tipo(type_InternalProcces, tam);
    console.log("Agregando Operacion 5");
    
  }

  selector_tipo(type_InternalProcces: any, tam: number){
    if(type_InternalProcces == 'Matt')
      this.datos_Matt(tam);
    else if(type_InternalProcces == 'if')
      this.datos_if(tam);
    else if(type_InternalProcces == 'else')
      this.datos_else(tam);
    else if(type_InternalProcces == 'Mod_var')
      this.datos_Mod_var(tam);
  }

  datos_Matt(posicion: number){
    let formato_Matt: any = this.operaciones(posicion, 'Matt', '');

    formato_Matt.vars.push(this.variables('Numero'));
    formato_Matt.vars.push(this.variables('Numero'));

    let form_Matt: FormGroup= this.formBuilder.group({
      new_exist: [''],
      var_1: [''],
      opc_operation: [''],
      opc_type_2: [''],
      var_2:['']
    });

    this.Internal_Process.push(formato_Matt);
    this.from_InternalProcess.push(form_Matt);
  }

  datos_if(posicion: number){
    let formato_if: any = this.operaciones(posicion, 'if', '');

    formato_if.vars.push(this.variables(''));
    formato_if.vars.push(this.variables(''));

    let form_if: FormGroup= this.formBuilder.group({
      new_exist: [''],
      opc_data_1: [''],
      var_1: [''],
      opc_operation: [''],
      opc_type_2: [''],
      var_2:['']
    });
    

    this.Internal_Process.push(formato_if);
    this.from_InternalProcess.push(form_if);
  }

  datos_else(posicion: number){
    let formato_else: any = this.operaciones(posicion, 'else', '');

    let form_else: FormGroup= this.formBuilder.group({
    });

    this.Internal_Process.push(formato_else);
    this.from_InternalProcess.push(form_else);
  }

  datos_Mod_var(posicion: number){
    let formato_Mod_var: any = this.operaciones(posicion, 'Mod_var', '=');
    
    formato_Mod_var.vars.push(this.variables('Cadena'));
    formato_Mod_var.vars.push(this.variables('Cadena'));

    let form_Mod_var: FormGroup= this.formBuilder.group({
      new_exist: [''],
      var_1: [''],
      opc_type_2: [''],
      var_2:['']
    });

    this.Internal_Process.push(formato_Mod_var);
    this.from_InternalProcess.push(form_Mod_var);
  }

  operaciones(posicion: number, type_operation:string, opc_operation: string){
    let formato_Opc: any={
      id_operacion: '',
      id_block: '',
      order_opc: posicion,
      type_operation: type_operation,
      new_exist: '',
      id_var_1: '',
      opc_operation: opc_operation,
      id_var_2: '',
      vars: []
    }

    return formato_Opc;
  }

  variables(type_data){
    let var_: any={
      id_var: '',
      id_operacion: '',
      opc_type: '',
      opc_data: type_data,
      var: ''
    }
    return var_;
  }

  actualizar_variables(tam: number){
    let validacion: boolean= true;

    if(this.Internal_Process[tam].type_operation == 'Matt'){
      if(this.from_InternalProcess[tam].value.new_exist == 'nueva'){
        return this.alertar_agregar_var(this.from_InternalProcess[tam].value.var_1, 'Numero');
      }
    }

    else if(this.Internal_Process[tam].type_operation == 'if'){
      if(this.from_InternalProcess[tam].value.new_exist == 'nueva'){
        return this.alertar_agregar_var(this.from_InternalProcess[tam].value.var_1, this.from_InternalProcess[tam].value.opc_data_1);
      }
    }
    return validacion; 
  }

  alertar_agregar_var(var_val:string, type: string){
    let validacion: boolean= true;

    if(this.existencias_de_variables(var_val)){
      alert("La variable: "+var_val+", ya existe. Antes de agregar otra operacion o guardar el bloque, modifica el nombre de la variable");
      return validacion=false;
    }
    else if(type == 'Numero')
      this.list_num.push(var_val);
    else if(type == 'Cadena')
      this.list_cad.push(var_val);

    return validacion;
  }

  existencias_de_variables(var_: string){
    let validacion: boolean= false;
    for(let cont=0;cont<this.list_cad.length;cont++)
      if(this.list_cad[cont] == var_)
        return validacion=true;
    for(let cont=0;cont<this.list_num.length;cont++)
      if(this.list_num[cont] == var_)
        return validacion=true;
    
    return validacion;

  }


  eliminarOperacion(index: number){
    this.Internal_Process.splice(index, 1);
    this.from_InternalProcess.splice(index, 1);
  }

  handleSuccessfulSaveTodo(datos: IntefazInternalProcess) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
  }

  handleSuccessfulEditTodo(datos: IntefazInternalProcess) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
  }

  

}
