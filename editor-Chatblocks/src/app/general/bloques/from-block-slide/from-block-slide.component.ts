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
  blk_edit: any;
  

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
      elementos:[''],
      tag_active: [false]
    });
    if (!this.createMode) {
      this.loadBloque(this.bloque); 
    }
  }

  loadBloque(bloque){
    
    this.fromBlksSlide.patchValue(bloque);
    this.globals.elementosG=bloque.elementos;
    this.blk_edit=JSON.parse(JSON.stringify( bloque ));
    

    this.edit_opcElm=bloque.opc_elm;
    this.edit_opcNX=bloque.opc_nextid;
    this.edit_NX=bloque.next_id;
    this.edit_nom_estado=bloque.namestate;
  }
  

  saveBlockSlide(c_e: string) {
    if(this.globals.elementosG.length > 0 && this.valiacion_datos() && (c_e == 'crear')){
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
      let botones_elm;
      
      if(this.fromBlksSlide.value.opc_elm == 'Una sola transición'){
        datosBloque.next_id=this.fromBlksSlide.value.next_id;
      }
      else if(this.fromBlksSlide.value.opc_elm == 'Una transición por elemento'){
        this.validar_datos_botones();  
        cadNI=this.globals.elementosG[0].botones[0].contentbutton;        
        
        if(this.globals.elementosG[0].botones.length == 2)
          if(this.globals.elementosG[0].botones[1].typebutton == 'postback')
            cadNI=cadNI+','+this.globals.elementosG[0].botones[1].contentbutton;
        
        for(let i=1;i<this.globals.elementosG.length;i++)
          for(let cont_btn=0;cont_btn<this.globals.elementosG[i].botones.length;cont_btn++){
            if(this.globals.elementosG[i].botones[cont_btn].typebutton == 'postback')
              cadNI=cadNI+','+this.globals.elementosG[i].botones[cont_btn].contentbutton;
            if(this.globals.elementosG[i].botones[cont_btn].opc_nextid == 'Seleccionar de la lista' && datosBloque.tag_salida == false)
              datosBloque.tag_salida=true;
          }
      
        datosBloque.next_id=cadNI;
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
        this.validar_datos_botones();  
        cadNI=this.globals.elementosG[0].botones[0].contentbutton;        
        
        if(this.globals.elementosG[0].botones.length == 2)
          if(this.globals.elementosG[0].botones[1].typebutton == 'postback')
            cadNI=cadNI+','+this.globals.elementosG[0].botones[1].contentbutton;
        
        for(let i=1;i<this.globals.elementosG.length;i++)
          for(let cont_btn=0;cont_btn<this.globals.elementosG[i].botones.length;cont_btn++){
            if(this.globals.elementosG[i].botones[cont_btn].typebutton == 'postback')
              cadNI=cadNI+','+this.globals.elementosG[i].botones[cont_btn].contentbutton;
            if(this.globals.elementosG[i].botones[cont_btn].opc_nextid == 'Seleccionar de la lista' && datosBloque.tag_salida == false)
              datosBloque.tag_salida=true;
          }
      
        datosBloque.next_id=cadNI;
      }

      this.bloqueS=datosBloque;
      this.bloqueS.elementos=this.globals.elementosG;
      this.bloqueS.tags_entradas=this.bloque.tags_entradas;
      console.log("PASO_1");
      this.blkSlideService.updateBlkSlide(datosBloque).subscribe(response=>{
        this.guardar_edicion_ELM();
      });
      this.handleSuccessfulEditTodo(datosBloque);
        //.catch(err => console.error(err));
    }
  }
  else if(c_e == 'crear'){
    if(this.bandera_Elementos)
      alert("Debes tener al menos un elemento generado y llenar todos los campos");
    
    
  }
    
  }

  valiacion_datos(){
    if(this.fromBlksSlide.value.opc_elm == 'Una sola transición' && (this.fromBlksSlide.value.opc_nextid == '' || (this.fromBlksSlide.value.opc_nextid == 'Seleccionar de la lista' && this.fromBlksSlide.value.next_id == '')))
      return false;
    return true;
  }

  validar_datos_botones(){
    for(let cont_elm=0;cont_elm<this.globals.elementosG.length;cont_elm++)
      for(let cont_btn=0;cont_btn<this.globals.elementosG[cont_elm].botones.length;cont_btn++){
        if(this.globals.elementosG[cont_elm].botones[cont_btn].typebutton != 'postback'){
          this.globals.elementosG[cont_elm].botones[cont_btn].typebutton= 'postback';
          this.globals.elementosG[cont_elm].botones[cont_btn].opc_nextid= 'Generar automaticamente';
        }
        else if(this.globals.elementosG[cont_elm].botones[cont_btn].opc_nextid == '')
          this.globals.elementosG[cont_elm].botones[cont_btn].opc_nextid= 'Generar automaticamente';
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
    //?????????
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
        console.log("Boton actualizado: "+this.bloqueS.elementos[i].botones[0].titlebutton+", id: "+this.bloqueS.elementos[i].botones[0].id_boton);
        for(let j=0;j<this.bloque.elementos.length;j++)
          if(this.bloque.elementos[j].id_elements == this.bloqueS.elementos[i].id_elements){
            if(this.bloque.elementos[j].botones.length == 2 && this.bloqueS.elementos[i].botones.length == 2){
              if(this.bloqueS.elementos[i].botones[1].id_boton != 'sin almacenar'){
                this.botonesService.addDatosBoton(this.bloqueS.elementos[i].botones[1]).subscribe(response=> {
                  const datos='{"id_elemento": "'+this.bloqueS.elementos[i].id_elements+'", "title": "'+this.bloqueS.elementos[i].botones[1].titlebutton+'"}';
                  this.botonesService.getBotonDt(datos).subscribe(responseB=> {
                    this.bloqueS.elementos[i].botones[1].id_boton=responseB[0].id_boton;
                  });
                });
                this.botonesService.deleteBoton(this.bloque.elementos[j].botones[1].id_boton).subscribe(response=> {});
              }
              else 
                this.botonesService.updateBoton(this.bloqueS.elementos[i].botones[1]).subscribe(response=> {});
            }              
            else if(this.bloque.elementos[j].botones.length == 2 && this.bloqueS.elementos[i].botones.length == 1)
              this.botonesService.deleteBoton(this.bloque.elementos[j].botones[1].id_boton).subscribe(response=> {});
            else if(this.bloque.elementos[j].botones.length == 1 && this.bloqueS.elementos[i].botones.length == 2)
              this.botonesService.addDatosBoton(this.bloqueS.elementos[i].botones[1]).subscribe(response=> {
                const datos='{"id_elemento": "'+this.bloqueS.elementos[i].id_elements+'", "title": "'+this.bloqueS.elementos[i].botones[1].titlebutton+'"}';
                this.botonesService.getBotonDt(datos).subscribe(responseB=> {
                  this.bloqueS.elementos[i].botones[1].id_boton=responseB[0].id_boton;
                });
              });
            break;
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
      this.crear_tag();
      this.globals.AllBlocks.pop();
      this.globals.AllBlocks.push([this.bloqueS]);
      this.globals.AllBlocks.push([]);
      this.globals.generar_Id();      
      this.handleSuccessfulSaveTodo(this.bloqueS);
      this.globals.elementosG=[]; 
      return;
    }
          
  }

  crear_tag(){

    if(this.bloqueS.opc_elm=='Una sola transición' && this.bloqueS.opc_nextid== 'Seleccionar de la lista'){
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == this.bloqueS.next_id){
            this.globals.AllBlocks[i][j].tags_entradas.push(this.bloqueS.namestate);
            return;
          }
    }
    else if(this.bloqueS.opc_elm=='Una transición por elemento'){
      for(let i=0;i<this.bloqueS.elementos.length;i++)
        for(let cont_btn=0;cont_btn<this.bloqueS.elementos[i].botones.length;cont_btn++)
          if(this.bloqueS.elementos[i].botones[cont_btn].opc_nextid == "Seleccionar de la lista")
            for(let x=0;x<this.globals.AllBlocks.length;x++)
              for(let y=0;y<this.globals.AllBlocks[x].length;y++)
                if(this.globals.AllBlocks[x][y].namestate == this.bloqueS.elementos[i].botones[cont_btn].contentbutton){
                  this.globals.AllBlocks[x][y].tags_entradas.push(this.bloqueS.namestate+" -> "+this.bloqueS.elementos[i].title+" -> "+this.bloqueS.elementos[i].botones[cont_btn].titlebutton);
                  break;
                }                  
    }
  }


  editar_tag(){
    if(this.bloqueS.opc_elm=='Una sola transición' && this.edit_opcElm=='Una sola transición'){
      this.caso1_editTags();
      this.bloqueS.tag_salida=false;
    }
    else if(this.bloqueS.opc_elm=='Una sola transición' && this.edit_opcElm=='Una transición por elemento'){
      this.caso2_editTags();
      this.crear_tag();
      this.bloqueS.tag_salida=false;
    }
    else if(this.bloqueS.opc_elm=='Una transición por elemento' && this.edit_opcElm=='Una transición por elemento'){
      this.caso2_editTags();
      this.caso3_editTags();
      this.bloqueS.tag_salida=true;
    }
    else if(this.bloqueS.opc_elm=='Una transición por elemento' && this.edit_opcElm=='Una sola transición'){
      this.caso4_editTags();
      this.bloqueS.tag_salida=true;
    }
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
    for(let elm=0;elm<this.blk_edit.elementos.length;elm++)
      for(let cont_btn=0;cont_btn<this.blk_edit.elementos[elm].botones.length;cont_btn++)
        if(this.blk_edit.elementos[elm].botones[cont_btn].opc_nextid == "Seleccionar de la lista")
          for(let i=0;i<this.globals.AllBlocks.length;i++)
            for(let j=0;j<this.globals.AllBlocks[i].length;j++)
              if(this.globals.AllBlocks[i][j].namestate == this.blk_edit.elementos[elm].botones[cont_btn].contentbutton){
                this.eliminar_tag((this.blk_edit.namestate+" -> "+this.blk_edit.elementos[elm].title+" -> "+this.blk_edit.elementos[elm].botones[cont_btn].titlebutton), i, j);
                break;
              }
              
  }

  caso3_editTags(){
    for(let elm=0;elm<this.bloqueS.elementos.length;elm++)
      for(let cont_btn=0;cont_btn<this.bloqueS.elementos[elm].botones.length;cont_btn++)
        if(this.bloqueS.elementos[elm].botones[cont_btn].opc_nextid == "Seleccionar de la lista")
          for(let i=0;i<this.globals.AllBlocks.length;i++)
            for(let j=0;j<this.globals.AllBlocks[i].length;j++)
              if(this.bloqueS.elementos[elm].botones[cont_btn].contentbutton == this.globals.AllBlocks[i][j].namestate){
                this.globals.AllBlocks[i][j].tags_entradas.push(this.bloqueS.namestate+" -> "+this.bloqueS.elementos[elm].title+" -> "+this.bloqueS.elementos[elm].botones[cont_btn].titlebutton);
                break;
              }
  }

  caso4_editTags(){
    if(this.blk_edit.opc_nextid == "Seleccionar de la lista")
      for(let i=0;i<this.globals.AllBlocks.length;i++)
        for(let j=0;j<this.globals.AllBlocks[i].length;j++)
          if(this.globals.AllBlocks[i][j].namestate == this.blk_edit.next_id){
            this.eliminar_tag(this.blk_edit.namestate, i, j);
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

    if(this.fromBlksSlide.value.opc_elm != ''){
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
    else
      alert('Antes de crear un elemento, debes de llenar el campo "Opciones de transicion de estado"' );  
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

  /*control_required_opc(){

    let pos_boton = document.getElementById("btn1Cont");

    if(this.fromBlksSlide.value.opc_elm=='Una transición por elemento'){
      let elemento = document.getElementById("opc_nextid");
      console.log("CAMPO Una transición por elemento");
      if(elemento != null){

        elemento.removeAttribute("required");
        let div = document.getElementById("div_opc_nx").innerHTML='';
      }
    }
    else if(this.fromBlksSlide.value.opc_elm=='Una sola transición'){
      let div = document.getElementById("div_opc_nx");
      console.log("CAMPO Una sola transición");
      //elemento.setAttribute("required","");
      if(document.getElementById("opc_nextid") == null){
        div.insertAdjacentHTML('beforeend', '<label for="opc_nextid">Opciones de siguiente estado*</label>');
        div.insertAdjacentHTML('beforeend', '<select name="OS" id="opc_nextid" placeholder="Selecciona opcion" class="form-control" formControlName="opc_nextid" required><option value="Generar automaticamente">Generar automaticamente</option><option value="Seleccionar de la lista">Seleccionar de la lista</option></select>');
      }

      
    let pos_boton = document.getElementById("opc_nextid");
        
    if(this.fromBlksSlide.value.opc_elm=='Una sola transición'){
      if(pos_boton != null){
        console.log("Una sola transición");
        pos_boton.setAttribute("required","");
      }
      else
        console.log("vacio");
    }   
    
  }*/
 

}
