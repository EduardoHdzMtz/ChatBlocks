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
  edit_opcElm: string;
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

    this.edit_opcElm=bloque.opc_elm;
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
      datosBloque.tag_salida=false;
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
        for(let elm=1;elm<this.globals.elementosG.length;elm++){
          if(this.globals.elementosG[elm].opc_nextid == 'Seleccionar de la lista'){
            datosBloque.tag_salida=true;
            break;
          }
        }
      }

      this.blkSlideService.addDatosBlkSlide(datosBloque).subscribe(response =>{
        console.log("GUARDANDO BLOQUE SLIDE")
        const datos='{"id_robot": "'+datosBloque.id_robot+'", "namestate": "'+datosBloque.namestate+'"}';
        this.blkSlideService.getBlk(datos).subscribe(response=> {
          datosBloque.id_block=response[0].id_block;
          datosBloque.tags_entradas=[];
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
      datosBloque.tag_salida=false;
      
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
        for(let elm=1;elm<this.globals.elementosG.length;elm++){
          if(this.globals.elementosG[elm].opc_nextid == 'Seleccionar de la lista'){
            datosBloque.tag_salida=true;
            break;
          }
        }
      }

      this.bloqueS=datosBloque;
      this.bloqueS.elementos=this.globals.elementosG;
      this.bloqueS.tags_entradas=this.bloque.tags_entradas;


      if(this.fromBlksSlide.value.opc_elm == 'Una transición por elemento'){
        for(let elm=1;elm<this.globals.elementosG.length;elm++)
          if(this.globals.elementosG[elm].opc_nextid == 'Seleccionar de la lista'){
            datosBloque.tag_salida=true;
            break;
          }
        
      }
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

    for(let i=0;i<this.globals.AllBlocks.length;i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        if(this.globals.AllBlocks[i][j].id_block == this.bloqueS.id_block && this.globals.AllBlocks[i][j].blocktype == this.bloqueS.blocktype){
          this.globals.AllBlocks[i][j]=this.bloqueS;
          this.globals.AllBlocks[i][j].tags_entradas=this.bloqueS.tags_entradas;
        }
      }
    }
    this.editar_tag();

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
      this.crear_tag();
      this.handleSuccessfulSaveTodo(this.bloqueS);
      this.globals.elementosG=[]; 
      return;
    }
          
  }

  crear_tag(){

    if(this.bloqueS.opc_elm=='Una sola transición' && this.bloqueS.opc_nextid== 'Seleccionar de la lista')
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == this.bloqueS.next_id)
            this.globals.AllBlocks[i][j].tags_entradas.push(this.bloqueS.namestate);
    
    else if(this.bloqueS.opc_elm=='Una transición por elemento')
      for(let i=0;i<this.bloqueS.elementos.length;i++)
        if(this.bloqueS.elementos[i]=="Seleccionar de la lista")
          for(let x=0;x<this.globals.AllBlocks.length;x++)
            for(let y=0;y<this.globals.AllBlocks[x].length;y++)
              if(this.globals.AllBlocks[x][y].namestate == this.bloqueS.elementos[i].nextid)
                this.globals.AllBlocks[x][y].tags_entradas.push(this.bloqueS.namestate+" -> "+this.bloqueS.elementos[i].title);
  }


  editar_tag(){
    if(this.bloqueS.opc_elm=='Una sola transición' && this.edit_opcElm=='Una sola transición')
      this.caso1_editTags();
    else if(this.bloqueS.opc_elm=='Una sola transición' && this.edit_opcElm=='Una transición por elemento'){
      this.caso2_editTags();
      this.crear_tag();
    }
    else if(this.bloqueS.opc_elm=='Una transición por elemento' && this.edit_opcElm=='Una transición por elemento'){
      this.caso2_editTags();
      this.caso3_editTags();
    }
    else if(this.bloqueS.opc_elm=='Una transición por elemento' && this.edit_opcElm=='Una sola transición')
      this.caso4_editTags();
  }

  caso1_editTags(){
    if(this.bloqueS.opc_nextid=="Seleccionar de la lista" && this.edit_opcNX=="Generar automaticamente"){
      this.crear_tag(); 
    }
    else if(this.bloqueS.opc_nextid=="Generar automaticamente" && this.edit_opcNX=="Seleccionar de la lista"){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == this.edit_NX){
            this.eliminar_tag(this.edit_nom_estado, i, j);
            break;
          }    
    }
    else if(this.bloqueS.opc_nextid=="Seleccionar de la lista" && this.edit_opcNX=="Seleccionar de la lista"){
      if((this.edit_NX != this.bloqueS.next_id) || (this.edit_nom_estado != this.bloqueS.namestate))
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++){
          if(this.globals.AllBlocks[i][j].namestate == this.edit_NX){
            this.eliminar_tag(this.edit_nom_estado, i, j);
          }
          if(this.globals.AllBlocks[i][j].namestate == this.bloqueS.next_id)
            this.globals.AllBlocks[i][j].tags_entradas.push(this.bloqueS.namestate);
        }
    }
    
    let arr_sigEstado;
    if(this.edit_nom_estado != this.bloqueS.namestate){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++){
          arr_sigEstado = this.globals.AllBlocks[i][j].next_id.split(",");
          for(let x=0;x<arr_sigEstado.length;x++)
            if(arr_sigEstado[x]==this.edit_nom_estado){
              if(arr_sigEstado.length>1)
                this.editar_nom(i, j, x, this.bloqueS.namestate, arr_sigEstado);
              else
                this.globals.AllBlocks[i][j].next_id=this.bloqueS.namestate;                
            }          
        }
    }

  }

  caso2_editTags(){
    for(let elm=0;elm<this.bloque.elementos.length;elm++)
      if(this.bloque.elementos[elm].opc_nextid == "Seleccionar de la lista")
        for(let i=0;i<this.globals.AllBlocks.length;i++)
          for(let j=0;j<this.globals.AllBlocks[i].length;j++)
            if(this.globals.AllBlocks[i][j].namestate == this.bloque.elementos[elm].nextid){
              this.eliminar_tag((this.bloque.namestate+" -> "+this.bloque.elementos[elm].title), i, j);
              break;
            }               
  }

  caso3_editTags(){
    for(let elm=0;elm<this.bloqueS.elementos.length;elm++)
      if(this.bloque.elementos[elm].opc_nextid == "Seleccionar de la lista")
        for(let i=0;i<this.globals.AllBlocks.length;i++)
          for(let j=0;j<this.globals.AllBlocks[i].length;j++)
            if(this.bloqueS.elementos[elm].nextid == this.globals.AllBlocks[i][j].namestate){
              this.globals.AllBlocks[i][j].tags_entradas.push(this.bloqueS.namestate+" -> "+this.bloqueS.elementos[elm].title);
              break;
            }
  }

  caso4_editTags(){
    if(this.bloque.opc_nextid == "Seleccionar de la lista")
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == this.bloque.next_id){
            this.eliminar_tag(this.bloque.namestate, i, j);
            break;
          }
    this.caso3_editTags();
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
      //console.log("- "+this.globals.AllBlocks[i][j].tags_entradas[y]);
      if(this.globals.AllBlocks[i][j].tags_entradas[y]==nom_estado)
        this.globals.AllBlocks[i][j].tags_entradas.splice(y, 1);
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
