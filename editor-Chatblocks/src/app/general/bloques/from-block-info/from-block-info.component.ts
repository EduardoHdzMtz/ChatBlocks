import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfazViewBlkInfo } from '../interfaces/interfaz-view-blk-info';
import { BlkInfoService } from '../../../sendToDB/blkInfo.service';
import { Globals } from '../interfaces/Globals';


@Component({
  selector: 'app-from-block-info',
  templateUrl: './from-block-info.component.html',
  styleUrls: ['./from-block-info.component.css']
})
export class FromBlockInfoComponent implements OnInit {

  fromBlksInfo: FormGroup;
  createMode: boolean=true;
  bloque: InterfazViewBlkInfo;
  states: string[]=[];
  edit_opcNX: string;
  edit_NX: string;
  edit_nom_estado: string;


  constructor(private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal, 
    private blkInfoService: BlkInfoService,
    public globals: Globals
    ) { }

  ngOnInit() {
    for(let i=0;i<this.globals.AllBlocks.length;i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        this.states.push(this.globals.AllBlocks[i][j].namestate);
      }
    }

    this.fromBlksInfo=this.formBuilder.group({
      namestate: ['', Validators.required],
      contenido: ['', Validators.required],
      opc_nextid: ['',Validators.required],
      next_id: [''],
      typingtime: ['', Validators.required]
    });

    if (!this.createMode) {
      this.loadBloque(this.bloque); 
    }
  }

  loadBloque(bloque){
    console.log("Opc NX Edit-> "+ bloque.opc_nextID);
    this.fromBlksInfo.patchValue(bloque);
    this.edit_opcNX=bloque.opc_nextid;
    this.edit_NX=bloque.next_id;
    this.edit_nom_estado=bloque.namestate;
  }
  

  saveBlockInfo() {
    if (this.fromBlksInfo.invalid) {
      return;
    }
    
    if (this.createMode){
      let datosBloque: InterfazViewBlkInfo = this.fromBlksInfo.value;
      datosBloque.id_block = '12';
      datosBloque.id_robot=this.globals.RobotSelect.id_robot;
      //datosBloque.opc_nextid = this.fromBlksInfo.value.opc_nextid;
      datosBloque.blocktype='informativo';
      datosBloque.contenttype='text';
      datosBloque.pos_x=0;
      datosBloque.pos_y=this.globals.AllBlocks.length-1;
      console.log("Opc NX-> "+ datosBloque.opc_nextid);
      console.log("NX-> "+ datosBloque.next_id);
      //todo.updateAt = new Date();

      this.blkInfoService.addDatosBlkInfo(datosBloque).subscribe(response =>{
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        this.blkInfoService.getBlk(datos).subscribe(response=> {    
          response[0].tags_entradas=[];  
          this.globals.AllBlocks.pop();
          this.globals.AllBlocks.push([response[0]]);
          this.globals.AllBlocks[this.globals.AllBlocks.length-1][0].opc_nextid=datosBloque.opc_nextid;
          this.globals.AllBlocks.push([]);
          let result= this.globals.generar_Id();
          this.crear_tag(datosBloque.opc_nextid, datosBloque.next_id, datosBloque.namestate);
          this.handleSuccessfulSaveTodo(datosBloque);
        });
      });
    } else{
      let datosBloque: InterfazViewBlkInfo = this.fromBlksInfo.value;
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
        /*for(let i=0;i<this.globals.AllBlocks.length;i++){
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){
            console.log(i+","+j+" -> "+this.globals.AllBlocks[i][j].namestate);
          }
        }*/
        this.editar_tag(datosBloque.opc_nextid, datosBloque.next_id,datosBloque.namestate);
      });
      this.handleSuccessfulEditTodo(datosBloque);
        //.catch(err => console.error(err));
    }
  }


  handleSuccessfulSaveTodo(datos: InterfazViewBlkInfo) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
  }

  handleSuccessfulEditTodo(datos: InterfazViewBlkInfo) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
  }

  crear_tag(opc_sigEstado: string, sigEstado: string, estado_actual: string){
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
      this.crear_tag(opc_sigEstado, sigEstado, estado_actual); 
    }
    else if(opc_sigEstado=="Generar automaticamente" && this.edit_opcNX=="Seleccionar de la lista"){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == this.edit_NX){
            if(this.edit_nom_estado == estado_actual)
              this.eliminar_tag(estado_actual, i, j);
            else
              this.eliminar_tag(this.edit_nom_estado, i, j);
          }    
    }
    else if(opc_sigEstado=="Seleccionar de la lista" && this.edit_opcNX=="Seleccionar de la lista"){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++){
          if(this.globals.AllBlocks[i][j].namestate == this.edit_NX){
            if(this.edit_nom_estado == estado_actual)
              this.eliminar_tag(estado_actual, i, j);
            else
              this.eliminar_tag(this.edit_nom_estado, i, j); 
          }
          if(this.globals.AllBlocks[i][j].namestate == sigEstado)
            this.globals.AllBlocks[i][j].tags_entradas.push(estado_actual);
        }
    }
    
    let arr_sigEstado;
    if(this.edit_nom_estado != estado_actual){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++){
          arr_sigEstado = this.globals.AllBlocks[i][j].next_id.split(",");
          for(let x=0;x<arr_sigEstado.length;x++)
            if(arr_sigEstado[x]==this.edit_nom_estado){
              if(arr_sigEstado.length>1)
                this.editar_nom(i, j, x, estado_actual, arr_sigEstado);
              else
                this.globals.AllBlocks[i][j].next_id=estado_actual;                
            }          
        }
    }

  }

  editar_nom(i, j, pos_nx, estado_actual, arr_sigEstado){
    arr_sigEstado[pos_nx]=estado_actual;
    let next_id='';
    let x=0;
    for(x=0;x<(arr_sigEstado.length-1);x++){
      next_id=next_id+arr_sigEstado[x]+',';
    }
    next_id=next_id+arr_sigEstado[x+1];
    this.globals.AllBlocks[i][j].next_id=next_id;
  }

  eliminar_tag(nom_estado, i, j){
    for(let y=0;y<this.globals.AllBlocks[i][j].tags_entradas.length;y++){
      console.log("- "+this.globals.AllBlocks[i][j].tags_entradas[y]);
      if(this.globals.AllBlocks[i][j].tags_entradas[y]==nom_estado)
        this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
    }
  }


}
