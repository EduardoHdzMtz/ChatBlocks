import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementosComponent } from '../componentes/elementos/elementos.component';
import { InterfazViewBlkSlide, InterfazElementosS } from '../interfaces/interfaz-view-blk-info';
import { BlkSlideService } from 'src/app/sendToDB/blkSlide.service';
import { Globals } from '../interfaces/Globals';
import { ElementoService } from 'src/app/sendToDB/elementos.service';
import { BotonesService } from 'src/app/sendToDB/botones.service';

@Component({
  selector: 'app-from-block-slide',
  templateUrl: './from-block-slide.component.html',
  styleUrls: ['./from-block-slide.component.css']
})
export class FromBlockSlideComponent implements OnInit {
  fromBlksSlide: FormGroup;
  createMode: boolean=true;
  bloque: InterfazViewBlkSlide;
  elementos: InterfazElementosS;
  states: string[]=[];
  bloqueS: any='';
  bandera_Elementos: boolean;
  edit_opcNX: string;
  edit_NX: string;
  edit_nom_estado: string;
  

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal,   
    private blkSlideService: BlkSlideService,
    private elementoService: ElementoService,
    private botonesService: BotonesService,
    public globals: Globals
    ) { }

  ngOnInit() {
    this.bandera_Elementos=true;
    this.globals.bandera_slide_nx= "Una transición por elemento";
    for(let i=0;i<this.globals.AllBlocks.length;i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        this.states.push(this.globals.AllBlocks[i][j].namestate);
      }
    }

    this.bloqueS ='';
    this.globals.elementosG=[];

    this.fromBlksSlide=this.formBuilder.group({
      namestate: ['', Validators.required],
      opc_elm: ['', Validators.required],
      opc_nextid: [''],
      next_id: [''],
      typingtime: ['', Validators.required],
      default_id: [''],
      save_var: ['', Validators.required],
      elementos:['']
    });
    if (!this.createMode) {
      this.loadBloque(this.bloque); 
    }
  }

  loadBloque(bloque){
    this.fromBlksSlide.patchValue(bloque);
    this.globals.elementosG=bloque.elementos;

    this.edit_opcNX=bloque.opc_nextid;
    this.edit_NX=bloque.next_id;
    this.edit_nom_estado=bloque.namestate;
  }
  

  saveBlockSlide() {
    if(this.globals.elementosG.length > 0){
    if (this.fromBlksSlide.invalid) {
      return;
    }
    
    if (this.createMode){
      let datosBloque: InterfazViewBlkSlide = this.fromBlksSlide.value;
      
      datosBloque.id_block = '2';
      datosBloque.id_robot=this.globals.RobotSelect.id_robot;      
      datosBloque.blocktype='slide';      
      datosBloque.pos_x=0;      
      datosBloque.pos_y=this.globals.AllBlocks.length-1;
      let cadNI: string='';
      
      if(this.fromBlksSlide.value.opc_elm == 'Una sola transición'){
        datosBloque.next_id=this.fromBlksSlide.value.next_id;
      }
      else if(this.fromBlksSlide.value.opc_elm == 'Una transición por elemento'){
        cadNI=this.globals.elementosG[0].nextid;
        for(let i=1;i<this.globals.elementosG.length;i++){
          cadNI=cadNI+','+this.globals.elementosG[i].nextid;
        }
        datosBloque.next_id=cadNI;
      }
      
      //todo.updateAt = new Date();
      //this.todoService.saveTodo(todo)
      this.blkSlideService.addDatosBlkSlide(datosBloque).subscribe(response =>{
        console.log("GUARDANDO BLOQUE SLIDE")
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        this.blkSlideService.getBlk(datos).subscribe(response=> {
          datosBloque.id_block=response[0].id_block;
          this.bloqueS=datosBloque;
          this.bloqueS.elementos=this.globals.elementosG;


          this.guardarElementos(0);          


          //this.globals.AllBlocks.pop();
          //this.globals.AllBlocks.push([response[0]]);
          //this.globals.AllBlocks.push([]);
          //this.globals.generar_Id();
          //this.handleSuccessfulSaveTodo(datosBloque);
        });
      });
      
      //.catch(err => console.error(err));
    } 
    else{
      /*let datosBloque: InterfazViewBlkSlide = this.fromBlksSlide.value;
      datosBloque.id_block = this.bloque.id_block;      
      datosBloque.id_robot=this.bloque.id_robot;
      datosBloque.blocktype='slide';
      datosBloque.pos_x=0;
      datosBloque.pos_y=this.globals.AllBlocks.length;
      //todo.updateAt = new Date();
      this.blkSlideService.updateBlkSlide(datosBloque).subscribe(response=>{
        for(let i=0;i<this.globals.AllBlocks.length;i++){
          if(this.globals.AllBlocks[i].id_block == datosBloque.id_block && this.globals.AllBlocks[i].blocktype == datosBloque.blocktype){
            this.globals.AllBlocks[i]=datosBloque;
          }
        }
      });
      this.handleSuccessfulEditTodo(datosBloque);
        //.catch(err => console.error(err));*/
    }
  }
  else{
    if(this.bandera_Elementos)
      alert("Debes tener al menos un elemento generado");
  }
    
  
  }



  guardarElementos(cont:number){
    console.log('Se estan guardando los elementos');
    if(cont < this.bloqueS.elementos.length){
      console.log("--------ELEMENTO GUARDADO:");
      console.log("id_block:"+this.bloqueS.id_block);
      this.bloqueS.elementos[cont].id_block=this.bloqueS.id_block;
      this.elementoService.addDatosElementos(this.bloqueS.elementos[cont]).subscribe(response=> {
        const datos='{"id_block": "'+this.bloqueS.id_block+'", "title": "'+this.bloqueS.elementos[cont].title+'"}';
        
        console.log("DATOS:"+datos);
        this.elementoService.getElementosDt(datos).subscribe(responseA=> {
          console.log("BOTONES: "+responseA);
          console.log("BOTONES2: "+responseA[0]);
          console.log("BOTONES2: "+responseA[0].id_elements);
          this.bloqueS.elementos[cont].id_elements=responseA[0].id_elements;
          this.bloqueS.elementos[cont].botones[0].id_elemento=responseA[0].id_elements;

          this.botonesService.addDatosBoton(this.bloqueS.elementos[cont].botones[0]).subscribe(response=> {
            const datos='{"id_elemento": "'+this.bloqueS.elementos[cont].id_elements+'", "title": "'+this.bloqueS.elementos[cont].botones[0].titlebutton+'"}';
            this.botonesService.getBotonDt(datos).subscribe(responseB=> {
              this.bloqueS.elementos[cont].botones[0].id_boton=responseB[0].id_boton;

              if(this.bloqueS.elementos[cont].botones.length==2){  
                
                this.bloqueS.elementos[cont].botones[1].id_elemento=responseA[0].id_elements;
                this.botonesService.addDatosBoton(this.bloqueS.elementos[cont].botones[1]).subscribe(response=> {
                  const datos='{"id_elemento": "'+this.bloqueS.elementos[cont].id_elements+'", "title": "'+this.bloqueS.elementos[cont].botones[1].titlebutton+'"}';
                  this.botonesService.getBotonDt(datos).subscribe(responseC=> {
                    this.bloqueS.elementos[cont].botones[1].id_boton=responseC[0].id_boton;
                    this.guardarElementos(cont+1);

                  });
                });          
              }
              else{
                this.guardarElementos(cont+1);
              }

            });
          });
        });
      });
    }
    else{
      this.globals.AllBlocks.pop();
      this.globals.AllBlocks.push([this.bloqueS]);
      this.globals.AllBlocks.push([]);
      this.globals.generar_Id();
      this.handleSuccessfulSaveTodo(this.bloqueS);
      this.globals.elementosG=[]; 
      return;
    }
          
  }

  




  handleSuccessfulSaveTodo(datos: InterfazViewBlkSlide) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
  }

  handleSuccessfulEditTodo(datos: InterfazViewBlkSlide) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
  }





  agregarElemento(){
    
    if(this.globals.elementosG.length < 11){
      if(this.fromBlksSlide.value.opc_elm != '')
        this.globals.bandera_slide_nx=this.fromBlksSlide.value.opc_elm;

      this.bandera_Elementos=false;
      const modal=this.modalService.open(ElementosComponent);
      modal.result.then(
        this.handleModalFromChatBotCloseADD.bind(this),
        this.handleModalFromChatBotCloseADD.bind(this)
      )      
    }
    else
      alert("Solo puedes generar un maximo de 10 elementos");    
  }



  handleModalFromChatBotCloseADD(){
    this.bandera_Elementos=true;
        
  }

  editarElemento(elemento: any){
    console.log("(((((( ELM: "+elemento);
    if(elemento!=''){
      let i: number=0;
      for(i=0;i<this.globals.elementosG.length;i++)
        if(elemento == this.globals.elementosG[i].title)
          break;
      console.log("@@@@@@ CONTADOR: "+i);
          

      let modal=this.modalService.open(ElementosComponent);   
      modal.result.then(
        this.handleModalTodoFormClose.bind(this),
        this.handleModalTodoFormClose.bind(this)
      )
      modal.componentInstance.createMode = false;
      modal.componentInstance.elemento = this.globals.elementosG[i];
      //alert("editando elemento:"+ this.globals.elementosG[i].title);
    }
  }

  handleModalTodoFormClose(response) {

  }  

  eliminarElemento(){

  }

}
