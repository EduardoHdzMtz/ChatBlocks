import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfazViewBlkInput } from '../interfaces/interfaz-view-blk-info';
import { BlkInputService } from 'src/app/sendToDB/blkInput.service';
import { Globals } from '../interfaces/Globals';

@Component({
  selector: 'app-from-block-input',
  templateUrl: './from-block-input.component.html',
  styleUrls: ['./from-block-input.component.css']
})
export class FromBlockInputComponent implements OnInit {

  fromBlksInput: FormGroup;
  createMode: boolean=true;
  bloque: InterfazViewBlkInput;
  states: string[]=[];
  edit_opcNX: string;
  edit_NX: string;

  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private blkInputService: BlkInputService, public globals: Globals) { }

  ngOnInit() {
    for(let i=0;i<this.globals.AllBlocks.length;i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        this.states.push(this.globals.AllBlocks[i][j].namestate);
      }
    }
    this.fromBlksInput=this.formBuilder.group({
      namestate: ['', Validators.required],
      contenido: ['', Validators.required],
      opc_nextid: ['',Validators.required],
      next_id: [''],
      typingtime: ['', Validators.required],
      validacion: ['', Validators.required],
      default_id: [''],
      save_var: ['', Validators.required]
    });

    if (!this.createMode) {
      this.loadTodo(this.bloque); 
    }
  }

  loadTodo(bloque){
    this.fromBlksInput.patchValue(bloque)
    this.edit_opcNX=bloque.opc_nextid;
    this.edit_NX=bloque.next_id;
  }

  saveBlockInput() {
    if (this.fromBlksInput.invalid) {
      return;
    }
    
    if (this.createMode){
      let datosBloque: InterfazViewBlkInput = this.fromBlksInput.value;
      datosBloque.id_block = '14';
      datosBloque.id_robot=this.globals.RobotSelect.id_robot;
      datosBloque.blocktype='input';
      datosBloque.contenttype='text';
      datosBloque.pos_x=0;
      datosBloque.pos_y=this.globals.AllBlocks.length;
      //todo.updateAt = new Date();
      //this.todoService.saveTodo(todo)

      this.blkInputService.addDatosBlkInput(datosBloque).subscribe(response =>{
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        console.log("Datos Input-> "+datos);
        this.blkInputService.getBlk(datos).subscribe(response=> {
          response[0].tags_entradas=[];  
          this.globals.AllBlocks.pop();
          this.globals.AllBlocks.push([response[0]]);
          this.globals.AllBlocks.push([]);
          this.globals.generar_Id();
          this.crear_tag(datosBloque.opc_nextid, datosBloque.next_id, datosBloque.blocktype,datosBloque.namestate);
          this.handleSuccessfulSaveTodo(datosBloque);
        });
      });
      
      //.catch(err => console.error(err));
    } else{
      let datosBloque: InterfazViewBlkInput = this.fromBlksInput.value;
      datosBloque.id_block = this.bloque.id_block; 
      datosBloque.id_robot=this.bloque.id_robot;          
      datosBloque.blocktype='input';
      datosBloque.contenttype='text';
      datosBloque.pos_x=0;
      datosBloque.pos_y=this.globals.AllBlocks.length-1;
      datosBloque.tags_entradas=this.bloque.tags_entradas;
      //todo.updateAt = new Date();
      
      this.blkInputService.updateBlkInput(datosBloque).subscribe(response=>{
        for(let i=0;i<this.globals.AllBlocks.length;i++){
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){
            if(this.globals.AllBlocks[i][j].id_block == datosBloque.id_block && this.globals.AllBlocks[i][j].blocktype == datosBloque.blocktype){
              this.globals.AllBlocks[i][j]=datosBloque;
              this.globals.AllBlocks[i][j].tags_entradas=datosBloque.tags_entradas;
            }
          }
        }
        this.editar_tag(datosBloque.opc_nextid, datosBloque.next_id,datosBloque.namestate);
      });
      //this.todoService.editTodo(todo)
      this.handleSuccessfulEditTodo(datosBloque);
        //.catch(err => console.error(err));
    }
  }

  crear_tag(opc_sigEstado: string, sigEstado: string, blockType: string, estado_actual: string){
    if(opc_sigEstado=="Seleccionar de la lista"){
      for(let i=0;i<this.globals.AllBlocks.length;i++){
        for(let j=0;j<this.globals.AllBlocks[i].length;j++){
          if(this.globals.AllBlocks[i][j].namestate == sigEstado){
            this.globals.AllBlocks[i][j].tags_entradas.push(estado_actual);
          }
        }
      }
    }    
  }

  editar_tag(opc_sigEstado: string, sigEstado: string, estado_actual: string){
    console.log("estado:"+sigEstado);
    console.log("tags:");

    if(opc_sigEstado=="Seleccionar de la lista" && this.edit_opcNX=="Generar automaticamente"){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == sigEstado)
            this.globals.AllBlocks[i][j].tags_entradas.push(estado_actual);   
    }
    else if(opc_sigEstado=="Generar automaticamente" && this.edit_opcNX=="Seleccionar de la lista"){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == this.edit_NX)
            for(let y=0;y<this.globals.AllBlocks[i][j].tags_entradas.length;y++){
              console.log("- "+this.globals.AllBlocks[i][j].tags_entradas[y]);
              if(this.globals.AllBlocks[i][j].tags_entradas[y]==estado_actual)
                this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
            }   
    }
    else if(opc_sigEstado=="Seleccionar de la lista" && this.edit_opcNX=="Seleccionar de la lista" && sigEstado!=this.edit_NX){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++){
          if(this.globals.AllBlocks[i][j].namestate == this.edit_NX){
            for(let y=0;y<this.globals.AllBlocks[i][j].tags_entradas.length;y++){
              console.log("- "+this.globals.AllBlocks[i][j].tags_entradas[y]);
              if(this.globals.AllBlocks[i][j].tags_entradas[y]==estado_actual)
                this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
            } 
          }
          if(this.globals.AllBlocks[i][j].namestate == sigEstado)
            this.globals.AllBlocks[i][j].tags_entradas.push(estado_actual);
          

        }
    } 

  }


  handleSuccessfulSaveTodo(datos: InterfazViewBlkInput) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
  }

  handleSuccessfulEditTodo(datos: InterfazViewBlkInput) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
  }

  



}
