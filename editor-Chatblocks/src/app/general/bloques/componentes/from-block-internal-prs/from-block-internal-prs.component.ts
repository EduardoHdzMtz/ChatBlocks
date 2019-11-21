import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntefazInternalProcess, IntefazOperaciones, InterfazVariables } from '../../interfaces/interfaz-view-blk-info';
import { BlkInternalPrs } from 'src/app/sendToDB/blkInternalPrs.service';
import { OperacionesService } from 'src/app/sendToDB/operaciones.service';
import { variablesService } from 'src/app/sendToDB/variables.service';
import { Globals } from '../../interfaces/Globals';
import { Response } from 'selenium-webdriver/http';

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
  bloque: IntefazInternalProcess;
  bloque_final: any;
  states: string[]=[];
  numeracion: number[]=[];
  num_datos_Suma: number= 3;
  num_datos_if: number=3;
  list_cad: string[];
  list_num: string[];
  bandera_tags: boolean;
  act_pos_x: number;
  act_pos_y: number;

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
    this.bandera_tags=false;
    for(let i=0;i<this.globals.AllBlocks.length;i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        this.states.push(this.globals.AllBlocks[i][j].namestate);
      }
    }

    this.cargar_var();

    this.from_Selector=this.formBuilder.group({
      namestate: [''],
      opc_nextid: [''],
      default_nextid: [''],
      opc_InernalProcess: ['']
    });

    for(let num=1;num<=100;num++)
      this.numeracion.push(num);

    this.Internal_Process=[];

    if (!this.createMode) {
      this.loadBloque(this.bloque); 
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


  loadBloque(Internal_Process){
    let datos_bloque: any={
      namestate: Internal_Process.namestate,
      default_nextid: Internal_Process.default_nextid,
      opc_InernalProcess: ''
    }

    this.from_Selector.patchValue(datos_bloque);

    for(let cont_opc=0; cont_opc<Internal_Process.operaciones.length; cont_opc++){
      this.selector_tipo(Internal_Process.operaciones[cont_opc].type_operation, cont_opc);
      if(Internal_Process.operaciones[cont_opc].type_operation != 'else'){ 
        let datos_operacion: any={
          new_exist: Internal_Process.operaciones[cont_opc].new_exist,
          opc_data_1: Internal_Process.operaciones[cont_opc].variables[0].opc_data,
          var_1: Internal_Process.operaciones[cont_opc].variables[0].var,
          opc_operation: Internal_Process.operaciones[cont_opc].opc_operation,
          opc_type_2: Internal_Process.operaciones[cont_opc].variables[1].opc_type,
          var_2: Internal_Process.operaciones[cont_opc].variables[1].var,
          opc_nextid: Internal_Process.operaciones[cont_opc].opc_nextid,
          default_nextid: Internal_Process.operaciones[cont_opc].next_id
        }

        this.from_InternalProcess[cont_opc].patchValue(datos_operacion);

        this.Internal_Process[cont_opc].id_operacion = Internal_Process.operaciones[cont_opc].id_operacion;
        this.Internal_Process[cont_opc].id_block = Internal_Process.operaciones[cont_opc].id_block;
        this.Internal_Process[cont_opc].order_opc = Internal_Process.operaciones[cont_opc].order_opc;
        this.Internal_Process[cont_opc].type_operation = Internal_Process.operaciones[cont_opc].type_operation;
        this.Internal_Process[cont_opc].new_exist= Internal_Process.operaciones[cont_opc].new_exist;
        this.Internal_Process[cont_opc].id_var_1 = Internal_Process.operaciones[cont_opc].id_var_1;
        this.Internal_Process[cont_opc].opc_operation = Internal_Process.operaciones[cont_opc].opc_operation;
        this.Internal_Process[cont_opc].id_var_2 = Internal_Process.operaciones[cont_opc].id_var_2;
        this.Internal_Process[cont_opc].opc_nextid = Internal_Process.operaciones[cont_opc].opc_nextid;
        this.Internal_Process[cont_opc].next_id = Internal_Process.operaciones[cont_opc].next_id;

        for(let cont_var=0; cont_var<Internal_Process.operaciones[cont_opc].variables.length; cont_var++){
          this.Internal_Process[cont_opc].variables[cont_var].id_var = Internal_Process.operaciones[cont_opc].variables[cont_var].id_var;
          this.Internal_Process[cont_opc].variables[cont_var].id_robot = Internal_Process.operaciones[cont_opc].variables[cont_var].id_robot;
          this.Internal_Process[cont_opc].variables[cont_var].opc_type = Internal_Process.operaciones[cont_opc].variables[cont_var].opc_type;
          this.Internal_Process[cont_opc].variables[cont_var].opc_data = Internal_Process.operaciones[cont_opc].variables[cont_var].opc_data;
          this.Internal_Process[cont_opc].variables[cont_var].var = Internal_Process.operaciones[cont_opc].variables[cont_var].var;
        }
      }
    }
  }

  save_InternalProcess(){
    if (this.from_InternalProcess[0].invalid) {
      return;
    }
    
    if (this.createMode){
      let datosBloque: IntefazInternalProcess = this.from_Selector.value;
      datosBloque.id_block = 'sin asignar';
      datosBloque.id_robot=this.globals.RobotSelect.id_robot;
      datosBloque.blocktype='internalProcess';
      datosBloque.pos_x=0;
      datosBloque.pos_y=this.globals.AllBlocks.length-1;
      datosBloque.operaciones=[];
      datosBloque.tag_salida=false;
      this.act_pos_x = 0;
      this.act_pos_y = this.globals.AllBlocks.length-1;

      this.blkInternalPrsService.addDatosBlkInternalPrs(datosBloque).subscribe(response =>{
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        this.blkInternalPrsService.getBlk(datos).subscribe(response=> {
          datosBloque.id_block=response[0].id_block;
          datosBloque.operaciones= this.Internal_Process;
          datosBloque.tags_entradas=[];  
          this.bloque_final=datosBloque;
          this.globals.AllBlocks.pop();
          this.globals.AllBlocks.push([datosBloque]);
          this.globals.AllBlocks.push([]);
          
          for(let cont_opc=0;cont_opc<this.from_InternalProcess.length;cont_opc++){
            this.generar_datos_operaciones(cont_opc);
          }

          this.crear_tag(this.bloque_final.opc_nextid, this.bloque_final.default_nextid, this.bloque_final.namestate);

          for(let cont_opc=0;cont_opc<this.from_InternalProcess.length;cont_opc++){
            if(this.bloque_final.operaciones[cont_opc].type_operation == 'if' || this.bloque_final.operaciones[cont_opc].type_operation == 'else')
              this.crear_tag(this.bloque_final.operaciones[cont_opc].opc_nextid, this.bloque_final.operaciones[cont_opc].next_id, this.bloque_final.namestate);
          }
          
          this.globals.AllBlocks[this.globals.AllBlocks.length-2][0].tag_salida=this.bandera_tags;

          this.globals.generar_Id();
          this.handleSuccessfulSaveTodo(datosBloque);
        });
      });       
      
    } else{
      let datosBloque: IntefazInternalProcess = this.from_Selector.value;
      datosBloque.id_block = this.bloque.id_block; 
      datosBloque.id_robot = this.globals.RobotSelect.id_robot;
      datosBloque.blocktype='internalProcess';
      datosBloque.pos_x=this.bloque.pos_x;
      datosBloque.pos_y=this.bloque.pos_y;
      this.act_pos_x = this.bloque.pos_x;
      this.act_pos_y = this.bloque.pos_y;
      
      this.blkInternalPrsService.updateBlkInternalPrs(datosBloque).subscribe(response=>{
        datosBloque.operaciones=[];
        datosBloque.tags_entradas=[];
        datosBloque.tag_salida=false;      

        this.bloque_final=datosBloque;
        this.bloque_final.operaciones=this.Internal_Process;
        this.bloque_final.tags_entradas=this.bloque.tags_entradas;

        for(let cont_opc=0;cont_opc<this.from_InternalProcess.length;cont_opc++){
          this.editar_operaciones(cont_opc);
        }
        let bandera_encontrado: boolean;
        for(let cont_opc_ant=0;cont_opc_ant<this.bloque.operaciones.length;cont_opc_ant++){
          bandera_encontrado=false;
          for(let cont_opc_act=0;cont_opc_act<this.bloque_final.operaciones.length;cont_opc_act++){
            if(this.bloque.operaciones[cont_opc_ant].id_operacion == this.bloque_final.operaciones[cont_opc_act].id_operacion){
              bandera_encontrado=true;
              break;
            }    
          }
          if(!bandera_encontrado)
            this.opcService.deleteOpc(this.bloque.operaciones[cont_opc_ant].id_operacion).subscribe(response=>{});    
        }
        this.handleSuccessfulEditTodo(datosBloque);
      });
      
    }
  }

  editar_operaciones(cont_opc: number){
    this.bloque_final.operaciones[cont_opc].order_opc = cont_opc;
    if(this.bloque_final.operaciones[cont_opc].id_block != 'sin asignar'){
      this.opcService.updateOpc(this.bloque_final.operaciones[cont_opc]).subscribe(responseOpc=>{
        this.casos_variables(cont_opc);
      });
    }
    else{
      this.generar_datos_operaciones(cont_opc);
    }        
  }

  generar_datos_operaciones(cont_opc: number){
    let opc_save: any ={
      id_operacion: 'sin asignar',
      id_block: this.bloque_final.id_block,
      order_opc: cont_opc,
      type_operation: this.Internal_Process[cont_opc].type_operation,
      new_exist: this.from_InternalProcess[cont_opc].value.new_exist,
      id_var_1: 0,
      opc_operation: this.from_InternalProcess[cont_opc].value.opc_operation,
      id_var_2: 0,
      opc_nextid: this.from_InternalProcess[cont_opc].value.opc_nextid,
      next_id: this.from_InternalProcess[cont_opc].value.next_id
    }
    
    this.bloque_final.operaciones[cont_opc].id_block = this.bloque_final.id_block;
    this.bloque_final.operaciones[cont_opc].order_opc = cont_opc;
    this.bloque_final.operaciones[cont_opc].type_operation = this.Internal_Process[cont_opc].type_operation;
    this.bloque_final.operaciones[cont_opc].new_exist = this.from_InternalProcess[cont_opc].value.new_exist;
    this.bloque_final.operaciones[cont_opc].opc_operation = this.from_InternalProcess[cont_opc].value.opc_operation;  
    this.bloque_final.operaciones[cont_opc].opc_nextid= this.from_InternalProcess[cont_opc].value.opc_nextid,
    this.bloque_final.operaciones[cont_opc].next_id= this.from_InternalProcess[cont_opc].value.next_id

    this.opcService.addDatosOpc(opc_save).subscribe(response =>{
      const datos='{"id_block": "'+opc_save.id_block+'", "order_opc": "'+opc_save.order_opc+'"}';
      this.opcService.getOpc_data(datos).subscribe(responseOpc=> {
        this.bloque_final.operaciones[cont_opc].id_operacion = responseOpc[0].id_operacion;
        this.casos_variables(cont_opc);
      });
    });

  }

  casos_variables(cont_opc: number){
    if(this.bloque_final.operaciones[cont_opc].type_operation != 'else'){
      /*if(this.bloque_final.operaciones[cont_opc].new_exist == 'nueva')
        this.almacenar_variable(cont_opc, 0);
      else if(this.bloque_final.operaciones[cont_opc].new_exist == 'existente')
        this.crear_datos_cargar(this.from_InternalProcess[cont_opc].value.var_1, cont_opc, 0);*/

      if(!this.crear_datos_cargar(this.from_InternalProcess[cont_opc].value.var_1, cont_opc, 0))
        this.almacenar_variable(cont_opc, 0);

      if(!this.crear_datos_cargar(this.from_InternalProcess[cont_opc].value.var_2, cont_opc, 1))
        this.almacenar_variable(cont_opc, 1);

      /*if(this.from_InternalProcess[cont_opc].value.opc_type_2 == 'Constante')
        this.almacenar_variable(cont_opc, 1);
      else if(this.from_InternalProcess[cont_opc].value.opc_type_2 == 'Variable')
        this.crear_datos_cargar(this.from_InternalProcess[cont_opc].value.var_2, cont_opc, 1);*/
    }
  }

  almacenar_variable(cont_opc: number, cont_var: number){
    this.bloque_final.operaciones[cont_opc].variables[cont_var].id_robot = this.globals.RobotSelect.id_robot;
    if(cont_var == 0){
      this.bloque_final.operaciones[cont_opc].variables[cont_var].opc_type = 'Variable';
      this.bloque_final.operaciones[cont_opc].variables[cont_var].var = this.from_InternalProcess[cont_opc].value.var_1;
    }
    else{
      this.bloque_final.operaciones[cont_opc].variables[cont_var].opc_type = this.from_InternalProcess[cont_opc].value.opc_type_2;
      this.bloque_final.operaciones[cont_opc].variables[cont_var].var = this.from_InternalProcess[cont_opc].value.var_2;
    }
    this.bloque_final.operaciones[cont_opc].variables[cont_var].opc_data = this.from_InternalProcess[cont_opc].value.opc_data_1;
    
    this.varService.addDatosVar(this.bloque_final.operaciones[cont_opc].variables[cont_var]).subscribe(response=> {
      const datos='{"id_robot": "'+this.globals.RobotSelect.id_robot+'", "var": "'+this.bloque_final.operaciones[cont_opc].variables[cont_var].var+'", "opc_data": "'+this.from_InternalProcess[cont_opc].value.opc_data_1+'"}';
        this.varService.getVar_data(datos).subscribe(responseVar=> {
          this.bloque_final.operaciones[cont_opc].variables[cont_var].id_var = responseVar[0].id_var;
          if(cont_var == 1){
            this.bloque_final.operaciones[cont_opc].id_var_2 = +responseVar[0].id_var;
            this.opcService.updateOpc(this.bloque_final.operaciones[cont_opc]).subscribe(responseUpOp=>{
              console.log("ACTUALIZANDO OPERACION");
              this.globals.AllBlocks[this.act_pos_x][this.act_pos_y]=this.bloque_final;
            });
          }
          else{
            this.bloque_final.operaciones[cont_opc].id_var_1 = +responseVar[0].id_var;
          }
        });
    });
  }

  crear_datos_cargar(nom_var: string, cont_opc: number, cont_var: number){
    for(let cont_var=0; cont_var<this.globals.conjunto_varaibles.length; cont_var++){
      if(this.globals.conjunto_varaibles[cont_var].var == nom_var){
        this.bloque_final.operaciones[cont_opc].variables[cont_var].id_var = this.globals.conjunto_varaibles[cont_var].id_var;
        return true;
      }
    }
    return false;
  }

  crear_tag(opc_nextid: string, next_id: string, namestate){
    if(opc_nextid == 'Seleccionar de la lista'){
      this.bandera_tags=true;
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == next_id){
            this.globals.AllBlocks[i][j].tags_entradas.push(namestate);
            return;
          }
    }
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

    formato_Matt.variables.push(this.variables('Numero'));
    formato_Matt.variables.push(this.variables('Numero'));

    let form_Matt: FormGroup= this.formBuilder.group({
      new_exist: [''],
      opc_data_1: [''],
      var_1: [''],
      opc_operation: [''],
      opc_type_2: [''],
      var_2:[''],
      opc_nextid: [''],
      next_id: ['']
    });

    this.Internal_Process.push(formato_Matt);
    this.from_InternalProcess.push(form_Matt);
  }

  datos_if(posicion: number){
    let formato_if: any = this.operaciones(posicion, 'if', '');

    formato_if.variables.push(this.variables(''));
    formato_if.variables.push(this.variables(''));
    
    let form_if: FormGroup= this.formBuilder.group({
      new_exist: [''],
      opc_data_1: [''],
      var_1: [''],
      opc_operation: [''],
      opc_type_2: [''],
      var_2:[''],
      opc_nextid: [''],
      next_id: ['']
    });
    

    this.Internal_Process.push(formato_if);
    this.from_InternalProcess.push(form_if);
  }

  datos_else(posicion: number){
    let formato_else: any = this.operaciones(posicion, 'else', '');

    formato_else.variables.push(this.variables('Numero'));
    formato_else.variables.push(this.variables('Numero'));

    let form_else: FormGroup= this.formBuilder.group({
      new_exist: [''],
      opc_data_1: [''],
      var_1: [''],
      opc_operation: [''],
      opc_type_2: [''],
      var_2:[''],
      opc_nextid: [''],
      next_id: ['']
    });

    this.Internal_Process.push(formato_else);
    this.from_InternalProcess.push(form_else);
  }

  datos_Mod_var(posicion: number){
    let formato_Mod_var: any = this.operaciones(posicion, 'Mod_var', '=');
    
    formato_Mod_var.variables.push(this.variables('Cadena'));
    formato_Mod_var.variables.push(this.variables('Cadena'));

    let form_Mod_var: FormGroup= this.formBuilder.group({
      new_exist: [''],
      opc_data_1: [''],
      var_1: [''],
      opc_operation: [''],
      opc_type_2: [''],
      var_2:[''],
      opc_nextid: [''],
      next_id: ['']
    });

    this.Internal_Process.push(formato_Mod_var);
    this.from_InternalProcess.push(form_Mod_var);
  }

  operaciones(posicion: number, type_operation:string, opc_operation: string){

    let formato: any={
      id_operacion: 'sin asignar',
      id_block: 'sin asignar',
      order_opc: posicion,
      type_operation: type_operation,
      new_exist: '',
      id_var_1: '',
      opc_operation: opc_operation,
      id_var_2: '',
      opc_nextid: '',
      next_id: ''
    }    

    let formato_Opc: IntefazOperaciones = formato;
    formato_Opc.variables=[];

    return formato_Opc;
  }

  variables(type_data){
    
    let formato: any={
      id_var: 'sin asignar',
      id_robot: this.globals.RobotSelect.id_robot,
      opc_type: '',
      opc_data: type_data,
      var: ''
    }

    let var_: InterfazVariables= formato;

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
