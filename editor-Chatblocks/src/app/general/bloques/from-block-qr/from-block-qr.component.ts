import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfazViewBlkQR } from '../interfaces/interfaz-view-blk-info';
import { BlkQRService } from 'src/app/sendToDB/blkQR.service';
import { Globals } from '../interfaces/Globals';

@Component({
  selector: 'app-from-block-qr',
  templateUrl: './from-block-qr.component.html',
  styleUrls: ['./from-block-qr.component.css']
})
export class FromBlockQRComponent implements OnInit {

  fromBlksQR: FormGroup;
  createMode: boolean=true;
  bloque: InterfazViewBlkQR;
  states: string[]=[];
  edit_opcNX: string;
  edit_NX: string;
  edit_nom_estado: string;

  constructor(private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal, 
    private blkQRService: BlkQRService,
    public globals: Globals
    ) { }

  ngOnInit() {
    for(let i=0;i<this.globals.AllBlocks.length;i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        this.states.push(this.globals.AllBlocks[i][j].namestate);
      }
    }

    this.fromBlksQR=this.formBuilder.group({
      namestate: ['', Validators.required],
      contenido: ['', Validators.required],
      opciones1: ['', Validators.required],
      opciones2: [''],
      opciones3: [''],
      opc_nextID1: ['',Validators.required],
      next_id1: [''],
      opc_nextID2: [''],
      next_id2: [''],
      opc_nextID3: [''],
      next_id3: [''],
      typingtime: ['', Validators.required],
      default_id: [''],
      save_var: ['', Validators.required]
    });

    if (!this.createMode) {
      this.loadTodo(this.bloque); 
    }
  }

  loadTodo(bloque){
    console.log("Opciones QR-> "+bloque.opciones);
    console.log("Opciones QR-> "+bloque.next_id);
    let opc=this.descomponerOPC(bloque.opciones);
    let nx_Id=this.descomponerOPC(bloque.next_id);
    let opcnxID=this.descomponerOPC(bloque.opc_nextid);

    this.edit_opcNX=bloque.opc_nextid;
    this.edit_NX=bloque.next_id;
    this.edit_nom_estado=bloque.namestate;

    let bloque2={
      id_block: bloque.id_block,
    namestate: bloque.namestate,
    id_robot: bloque.id_robot,
    contenido: bloque.contenido,
    opciones1: opc[0],
    opciones2: opc[1],
    opciones3: opc[2],
    opc_nextID1: opcnxID[0],
    next_id1: nx_Id[0],
    opc_nextID2: opcnxID[1],
    next_id2: nx_Id[1],
    opc_nextID3: opcnxID[2],
    next_id3: nx_Id[2],
    blocktype: bloque.blocktype,
    typingtime: bloque.typingtime,
    default_id: bloque.default_id,
    save_var: bloque.save_var,
    }
    this.fromBlksQR.patchValue(bloque2);    
  }

  descomponerOPC(cadena: string){
    console.log('Cadena a descomponer-> '+cadena)
    let opc=cadena.split(",");
    let opcArr: string[]=[];
    opcArr[0]='';
    opcArr[1]='';
    opcArr[2]='';

    for(let x=0;x<opc.length;x++){
      if(x==0){
        opcArr[0]=opc[x];
        console.log("0: Opc QR-> "+opc[x]+", from"+this.fromBlksQR.value.opciones1);
      }
      else if(x==1){
        opcArr[1]=opc[x];
        console.log("1: Opc QR-> "+opc[x]+", from"+this.fromBlksQR.value.opciones1);
      }
      else if(x==2){
        opcArr[2]=opc[x];
        console.log("2: Opc QR-> "+opc[x]+", from"+this.fromBlksQR.value.opciones1);
      }
    }

    return opcArr;
  }

  saveBlockQR() {
    if (this.fromBlksQR.invalid) {
      return;
    }
    
    if (this.createMode){
      let cadOPC: string='';
      let cadNextID: string='';
      let cadOPCNextID: string='';
      let datosBloque: InterfazViewBlkQR= this.fromBlksQR.value;

      cadOPC=this.fromBlksQR.value.opciones1;
      cadNextID=this.fromBlksQR.value.next_id1;
      cadOPCNextID=this.fromBlksQR.value.opc_nextID1;
      if(this.fromBlksQR.value.opciones2 != ''){        
        cadOPC=cadOPC+','+this.fromBlksQR.value.opciones2;
        cadNextID=cadNextID+','+this.fromBlksQR.value.next_id2;
        cadOPCNextID=cadOPCNextID+','+this.fromBlksQR.value.opc_nextID2;
      }
      if(this.fromBlksQR.value.opciones3 != ''){
        cadOPC=cadOPC+','+this.fromBlksQR.value.opciones3;
        cadNextID=cadNextID+','+this.fromBlksQR.value.next_id3;
        cadOPCNextID=cadOPCNextID+','+this.fromBlksQR.value.opc_nextID3;
      }      
      console.log("Crea-> cadOPCNextID: "+cadOPCNextID);
      
      datosBloque.id_block = '7';
      datosBloque.id_robot=this.globals.RobotSelect.id_robot;
      datosBloque.opciones=cadOPC;
      datosBloque.next_id=cadNextID;
      datosBloque.opc_nextid=cadOPCNextID;
      datosBloque.blocktype='quickReply';
      datosBloque.pos_x=0;
      datosBloque.pos_y=this.globals.AllBlocks.length-1;


      this.blkQRService.addDatosBlkQR(datosBloque).subscribe(response =>{
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        this.blkQRService.getBlk(datos).subscribe(response=> {
          response[0].tags_entradas=[];
          this.globals.AllBlocks.pop();
          this.globals.AllBlocks.push([response[0]]);
          console.log('Nuevo QR-> '+this.globals.AllBlocks[this.globals.AllBlocks.length-1][0].opc_nextid+', name: '+this.globals.AllBlocks[this.globals.AllBlocks.length-1][0].namestate);
          this.globals.AllBlocks.push([]);
          this.globals.generar_Id();
          this.crear_tag(datosBloque.opc_nextid, datosBloque.next_id, datosBloque.namestate);
          this.handleSuccessfulSaveTodo(datosBloque);
        });
      });
      
      //.catch(err => console.error(err));
    } else{
      let cadOPC: string='';
      let cadNextID: string='';
      let cadOPCNextID: string='';
      let datosBloque: InterfazViewBlkQR= this.fromBlksQR.value;      

      cadOPC=this.fromBlksQR.value.opciones1;
      cadNextID=this.fromBlksQR.value.next_id1;
      cadOPCNextID=this.fromBlksQR.value.opc_nextID1;
      if(this.fromBlksQR.value.opciones2 != ''){        
        cadOPC=cadOPC+','+this.fromBlksQR.value.opciones2;
        cadNextID=cadNextID+','+this.fromBlksQR.value.next_id2;
        cadOPCNextID=cadOPCNextID+','+this.fromBlksQR.value.opc_nextID2;
      }
      if(this.fromBlksQR.value.opciones3 != ''){
        cadOPC=cadOPC+','+this.fromBlksQR.value.opciones3;
        cadNextID=cadNextID+','+this.fromBlksQR.value.next_id3;
        cadOPCNextID=cadOPCNextID+','+this.fromBlksQR.value.opc_nextID3;
      } 
      

      datosBloque.id_block = this.bloque.id_block;
      datosBloque.id_robot=this.bloque.id_robot;
      datosBloque.opciones=cadOPC;
      datosBloque.next_id=cadNextID;
      datosBloque.opc_nextid=cadOPCNextID;
      datosBloque.blocktype='quickReply';
      datosBloque.pos_x=0;
      datosBloque.pos_y=this.globals.AllBlocks.length;  
      datosBloque.tags_entradas=this.bloque.tags_entradas;    

      //todo.updateAt = new Date();
      this.blkQRService.updateBlkQR(datosBloque).subscribe(response=>{
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


  handleSuccessfulSaveTodo(datos: InterfazViewBlkQR) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
  }

  handleSuccessfulEditTodo(datos: InterfazViewBlkQR) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
  }

  crear_tag(opc_sigEstado: string, sigEstado: string, estado_actual: string){
    let arr_opc_sigEstado = opc_sigEstado.split(",");
    let arr_sigEstado = sigEstado.split(",");

    for(let i=0;i<arr_sigEstado.length;i++){
      if(arr_opc_sigEstado[i]=="Seleccionar de la lista"){
        for(let x=0;x<this.globals.AllBlocks.length;x++){
          for(let y=0;y<this.globals.AllBlocks[x].length;y++){
            if(this.globals.AllBlocks[x][y].namestate == arr_sigEstado[i]){
              this.globals.AllBlocks[x][y].tags_entradas.push(estado_actual);
            }
          }
        }
      }
    }    
  }

  editar_tag(opc_sigEstado: string, sigEstado: string, estado_actual: string){
    console.log("----------...estado:"+sigEstado);
    console.log("tags:");

    let arr_edit_opc = this.edit_opcNX.split(",");
    let arr_edit_nx = this.edit_NX.split(",");


    for(let x=0;x<arr_edit_opc.length;x++)
      if(arr_edit_opc[x]=="Seleccionar de la lista")
        for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == arr_edit_nx[x]){
            if(this.edit_nom_estado == estado_actual)
              this.eliminar_tag(estado_actual, i, j);
            else
              this.eliminar_tag(this.edit_nom_estado, i, j);
          } 
          
    this.crear_tag(opc_sigEstado, sigEstado, estado_actual);
    
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
