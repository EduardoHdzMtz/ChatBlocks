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
  

  saveBlockSlide(c_e: string) {
    if(this.globals.elementosG.length > 0){
    if (this.fromBlksSlide.invalid) {
      return;
    }
    
    if (this.createMode && c_e == 'crear'){
      let datosBloque: InterfazViewBlkSlide = this.fromBlksSlide.value;
      
      datosBloque.id_block = 'sin almacenar';
      datosBloque.id_robot=this.globals.RobotSelect.id_robot;      
      datosBloque.blocktype='slide';      
      datosBloque.pos_x=0;      
      datosBloque.pos_y=this.globals.AllBlocks.length-1;
      let cadNI: string='';
      
      if(this.fromBlksSlide.value.opc_elm == 'Una sola transición'){
        datosBloque.next_id=this.fromBlksSlide.value.next_id;
      }
      else if(this.fromBlksSlide.value.opc_elm == 'Una transición por elemento'){
        cadNI=this.globals.elementosG[0].next_id;
        for(let i=1;i<this.globals.elementosG.length;i++){
          cadNI=cadNI+','+this.globals.elementosG[i].next_id;
        }
        datosBloque.next_id=cadNI;
      }

      this.blkSlideService.addDatosBlkSlide(datosBloque).subscribe(response =>{
        console.log("GUARDANDO BLOQUE SLIDE")
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        this.blkSlideService.getBlk(datos).subscribe(response=> {
          response[0].tags_entradas=[];
          datosBloque.id_block=response[0].id_block;
          this.bloqueS=datosBloque;
          this.bloqueS.elementos=this.globals.elementosG;


          this.guardarElementos(0);
        });
      });
    } 
    else if(c_e == 'crear'){
      let datosBloque: InterfazViewBlkSlide = this.fromBlksSlide.value;
      datosBloque.id_block = this.bloque.id_block; 
      datosBloque.id_robot=this.bloque.id_robot;
      datosBloque.blocktype='slide';
      datosBloque.pos_x=this.bloque.pos_x;
      datosBloque.pos_y=this.bloque.pos_y;
      this.bloqueS=datosBloque;
      this.bloqueS.elementos=this.globals.elementosG;
      //todo.updateAt = new Date();
      console.log("PASO_1");
      this.blkSlideService.updateBlkSlide(datosBloque).subscribe(response=>{
        this.guardar_edicion_ELM();
      });
      this.handleSuccessfulEditTodo(datosBloque);
        //.catch(err => console.error(err));
    }
  }
  else{
    if(this.bandera_Elementos)
      alert("Debes tener al menos un elemento generado");
  }
    
  }

  guardar_edicion_ELM(){
    console.log("PASO_2");
    for(let i=0;i<this.bloqueS.elementos.length;i++){
      console.log("PASO_3");
      if(this.bloqueS.elementos[i].id_elements == 'sin almacenar')
        this.crear_elemento(i);
      else
        this.editar_elemento(i);
    }

    let recorrido_elementos='sin_encontrar';
    for(let i=0;i<this.bloque.elementos.length;i++){
      recorrido_elementos='sin_encontrar';
      for(let j=0;j<this.bloqueS.elementos.length;j++)
        if(this.bloqueS.elementos[j].id_elements == this.bloque.elementos[i].id_elements)
          recorrido_elementos='encontrado'
      if(recorrido_elementos == 'sin_encontrar')
        this.elimina_elementos(i);
        
    }
      


    for(let i=0;i<this.globals.AllBlocks.length;i++){
      if(this.globals.AllBlocks[i].id_block == this.bloqueS.id_block && this.globals.AllBlocks[i].blocktype == this.bloqueS.blocktype){
        this.globals.AllBlocks[i]=this.bloqueS;
      }
    }
  }

  elimina_elementos(i: number){
    this.elementoService.deleteElementos(this.bloque.elementos[i].id_elements).subscribe(response=> {
      this.botonesService.deleteBotonELM(this.bloque.elementos[i].id_elements).subscribe(response=> {});
    });
  }

  editar_elemento(i: number){
    this.elementoService.updateElementos(this.bloqueS.elementos[i]).subscribe(response=>{
      this.botonesService.updateBoton(this.bloqueS.elementos[i].botones[0]).subscribe(response=> {
        for(let j=0;j<this.bloque.elementos.length;j++)
        if(this.bloque.elementos[j].id_elements == this.bloqueS.elementos[i].id_elements){
          if(this.bloque.elementos[j].botones.length == 2 && this.bloqueS.elementos[i].botones.length == 2)
            this.botonesService.updateBoton(this.bloqueS.elementos[i].botones[1]).subscribe(response=> {});
          else if(this.bloque.elementos[j].botones.length == 2 && this.bloqueS.elementos[i].botones.length == 1)
            this.botonesService.deleteBoton(this.bloque.elementos[j].botones[1].id_boton).subscribe(response=> {});
          else if(this.bloque.elementos[j].botones.length == 1 && this.bloqueS.elementos[i].botones.length == 2)
            this.botonesService.addDatosBoton(this.bloqueS.elementos[i].botones[1]).subscribe(response=> {
              const datos='{"id_elemento": "'+this.bloqueS.elementos[i].id_elements+'", "title": "'+this.bloqueS.elementos[i].botones[1].titlebutton+'"}';
              this.botonesService.getBotonDt(datos).subscribe(responseB=> {
                this.bloqueS.elementos[i].botones[1].id_boton=responseB[0].id_boton;
              });
            });
          }
      });
    });    
  }

  crear_elemento(i: number){
    console.log("PASO_4");
    this.bloqueS.elementos[i].id_block=this.bloque.id_block;
    this.elementoService.addDatosElementos(this.bloqueS.elementos[i]).subscribe(response=> {
      console.log("PASO_5");
      const datos='{"id_block": "'+this.bloqueS.id_block+'", "title": "'+this.bloqueS.elementos[i].title+'"}';
      
      console.log("DATOS:"+datos);
      this.elementoService.getElementosDt(datos).subscribe(responseA=> {
        console.log("PASO_6");
        //console.log("BOTONES: "+responseA);
        //console.log("BOTONES2: "+responseA[0]);
        //console.log("BOTONES2: "+responseA[0].id_elements);
        this.bloqueS.elementos[i].id_elements=responseA[0].id_elements;
        this.bloqueS.elementos[i].botones[0].id_elemento=responseA[0].id_elements;

        this.botonesService.addDatosBoton(this.bloqueS.elementos[i].botones[0]).subscribe(response=> {
          console.log("PASO_7");
          const datos='{"id_elemento": "'+this.bloqueS.elementos[i].id_elements+'", "title": "'+this.bloqueS.elementos[i].botones[0].titlebutton+'"}';
          this.botonesService.getBotonDt(datos).subscribe(responseB=> {
            this.bloqueS.elementos[i].botones[0].id_boton=responseB[0].id_boton;

            if(this.bloqueS.elementos[i].botones.length==2){
              this.bloqueS.elementos[i].botones[1].id_elemento=responseA[0].id_elements;
              this.botonesService.addDatosBoton(this.bloqueS.elementos[i].botones[1]).subscribe(response=> {
                const datos='{"id_elemento": "'+this.bloqueS.elementos[i].id_elements+'", "title": "'+this.bloqueS.elementos[i].botones[1].titlebutton+'"}';
                this.botonesService.getBotonDt(datos).subscribe(responseC=> {
                  this.bloqueS.elementos[i].botones[1].id_boton=responseC[0].id_boton;
                });
              });          
            }

          });
        });
      });
    });

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
      this.crear_tag(this.bloqueS.opc_nextid, this.bloqueS.next_id, this.bloqueS.namestate);
      this.handleSuccessfulSaveTodo(this.bloqueS);
      this.globals.elementosG=[]; 
      return;
    }
          
  }

  crear_tag(opc_sigEstado: string, sigEstado: string, estado_actual: string){
    let arr_opc_sigEstado = opc_sigEstado.split(",");
    let arr_sigEstado = sigEstado.split(",");

    if(this.bloqueS.opc_elm=='Una sola transición' && this.bloqueS.opc_nextid== 'Seleccionar de la lista')
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == sigEstado)
            this.globals.AllBlocks[i][j].tags_entradas.push(estado_actual);
    
    else if(this.bloqueS.opc_elm=='Una transición por elemento'){
      for(let i=0;i<this.bloqueS.elementos.length;i++){
        if(this.bloqueS.elementos[i]=="Seleccionar de la lista"){
          for(let x=0;x<this.globals.AllBlocks.length;x++){
            for(let y=0;y<this.globals.AllBlocks[x].length;y++){
              if(this.globals.AllBlocks[x][y].namestate == this.bloqueS.elementos[i].next_id){
                this.globals.AllBlocks[x][y].tags_entradas.push(estado_actual);
              }
            }
          }
        }
      }  
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
    if(elemento!=''){
      this.globals.bandera_slide_nx=this.fromBlksSlide.value.opc_elm;
      let i: number=0;
      for(i=0;i<this.globals.elementosG.length;i++)
        if(elemento == this.globals.elementosG[i].title)
          break;          

      let modal=this.modalService.open(ElementosComponent);   
      modal.result.then(
        this.handleModalTodoFormClose.bind(this),
        this.handleModalTodoFormClose.bind(this)
      )
      modal.componentInstance.createMode = false;
      modal.componentInstance.elemento = this.globals.elementosG[i];
    }
  }

  handleModalTodoFormClose(response) {

  }  

  eliminarElemento(elemento: any){
    if(elemento!=''){
      let i: number=0;
      for(i=0;i<this.globals.elementosG.length;i++)
        if(elemento == this.globals.elementosG[i].title)
          this.globals.elementosG.splice(i, 1);
    }
  }

}
