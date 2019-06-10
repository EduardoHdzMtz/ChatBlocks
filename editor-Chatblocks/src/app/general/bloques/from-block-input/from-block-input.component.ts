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
          this.globals.AllBlocks.pop();
          this.globals.AllBlocks.push([response[0]]);
          this.globals.AllBlocks.push([]);
          this.globals.generar_Id();
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
      //todo.updateAt = new Date();
      
      this.blkInputService.updateBlkInput(datosBloque).subscribe(response=>{
        for(let i=0;i<this.globals.AllBlocks.length;i++){
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){
            if(this.globals.AllBlocks[i][j].id_block == datosBloque.id_block && this.globals.AllBlocks[i][j].blocktype == datosBloque.blocktype){
              this.globals.AllBlocks[i][j]=datosBloque;
            }
          }
        }
      });
      //this.todoService.editTodo(todo)
      this.handleSuccessfulEditTodo(datosBloque);
        //.catch(err => console.error(err));
    }
  }


  handleSuccessfulSaveTodo(datos: InterfazViewBlkInput) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
  }

  handleSuccessfulEditTodo(datos: InterfazViewBlkInput) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
  }

  



}
