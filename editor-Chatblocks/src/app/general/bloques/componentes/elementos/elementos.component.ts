import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfazElementosS, InterfazBotones } from '../../interfaces/interfaz-view-blk-info';
import { ElementoService } from 'src/app/sendToDB/elementos.service';
import { Globals } from '../../interfaces/Globals';

@Component({
  selector: 'app-elementos',
  templateUrl: './elementos.component.html',
  styleUrls: ['./elementos.component.css']
})
export class ElementosComponent implements OnInit {

  fromElementos: FormGroup;
  createMode: boolean=true;
  elemento: InterfazElementosS;
  states: string[]=[];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder, 
    public activeModal: NgbActiveModal,
    private elementoService: ElementoService, 
    public globals: Globals
  ) { }

  ngOnInit() {
    for(let i=0;i<this.globals.AllBlocks.length;i++){
      for(let j=0;j<this.globals.AllBlocks[i].length;j++){
        this.states.push(this.globals.AllBlocks[i][j].namestate);
      }
    }

    this.fromElementos=this.formBuilder.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      image_url: ['',Validators.required],
      opc_nextid: [''],
      next_id: [''],
      btn1Title: ['', Validators.required],
      btn1Type: ['', Validators.required],
      btn1Cont: ['', Validators.required],
      btn2Title: [''],
      btn2Type: [''],
      btn2Cont: ['']
    });

    if (!this.createMode) {
      this.loadBloque(this.elemento); 
    }
  }

  loadBloque(elemento){
    console.log("TITULO ELM-> "+ elemento.title);
    console.log("BOTON-> ");
    console.log("TITULO-> "+ elemento.botones[0].titlebutton);
    //this.fromElementos.patchValue(elemento);
    let elemento_copia={
      title: elemento.title,
      subtitle: elemento.subtitle,
      image_url: elemento.image_url,
      opc_nextid: elemento.opc_nextid,
      next_id: elemento.next_id,
      btn1Title: elemento.botones[0].titlebutton,
      btn1Type: elemento.botones[0].typebutton,
      btn1Cont: elemento.botones[0].contentbutton,
      btn2Title: '',
      btn2Type: '',
      btn2Cont: ''
    }

    if(elemento.botones.length == 2)
      this.cargar_Datos_btn2(elemento_copia, elemento.botones[1]);
    else
      this.fromElementos.patchValue(elemento_copia);



  }

  cargar_Datos_btn2(elemento_copia: any, boton_2: any){
    elemento_copia.btn2Title=boton_2.titlebutton;
    elemento_copia.btn2Type=boton_2.typebutton;
    elemento_copia.btn2Cont=boton_2.contentbutton;
    this.fromElementos.patchValue(elemento_copia);
  }

  saveElemento(){
    if (this.fromElementos.invalid) {
      return;
    }
    
    if (this.createMode){
      let elementos: InterfazElementosS= this.fromElementos.value;
      //let boton1: InterfazBotones= this.fromElementos.value;
      //let boton2: InterfazBotones= this.fromElementos.value;
      let botones: any[]=[];
      elementos.id_elements='1';
      elementos.id_block='1';
      elementos.blocktype='slide';

      let boton1={
        id_boton:'1',
        id_elemento:'1',
        titlebutton:this.fromElementos.value.btn1Title,
        typebutton:this.fromElementos.value.btn1Type,
        contentbutton:this.fromElementos.value.btn1Cont
      };

      console.log('Boton 2-> '+boton1.titlebutton);
      botones.push(boton1);
      //botones[0]=boton1;
      

      if(this.fromElementos.value.btn2Title!=''){

        let boton2={
          id_boton:'2',
          id_elemento:'1',
          titlebutton:this.fromElementos.value.btn2Title,
          typebutton:this.fromElementos.value.btn2Type,
          contentbutton:this.fromElementos.value.btn2Cont
        }
        console.log('Boton 2-> '+boton2.titlebutton);

        botones.push(boton2);
      }

      //botones[0]=boton1;
      console.log('Boton 1-> '+boton1.titlebutton);

      for(let i=0;i<botones.length;i++){
        console.log(i+'-> For1-> '+botones[i].titlebutton);
      }
      console.log('BTN 1-> '+botones[0].titlebutton);
      //console.log('BTN 2-> '+botones[1].titlebutton);
      elementos.botones=botones;
      this.globals.elementosG.push(elementos);
      //this.globals.bloqueS.push(elementos);
      console.log('----------elementos------');
      for(let i=0;i<this.globals.elementosG.length;i++){
        console.log('--------------------');
        console.log(i+'-> '+this.globals.elementosG[i].title);
        console.log('Boton 1-> '+this.globals.elementosG[i].botones[0].titlebutton);
        //console.log('Boton 2-> '+this.globals.elementosG[i].botones[1].titlebutton);
      }
      console.log('--------------------');
      this.handleSuccessfulSaveTodo(elementos);

    } else{
      let elementos: InterfazElementosS= this.fromElementos.value;
      let boton1: InterfazBotones;
      let boton2: InterfazBotones;
      let botones: InterfazBotones[];
      elementos.id_elements=this.elemento.id_elements;
      elementos.id_block=this.elemento.id_block;
      elementos.blocktype='slide';

      boton1.id_boton=this.elemento.botones[0].id_boton;
      boton1.id_elemento=this.elemento.botones[0].id_elemento;
      boton1.titlebutton=this.fromElementos.value.btn1Title;
      boton1.typebutton=this.fromElementos.value.btn1Type;
      boton1.contentbutton=this.fromElementos.value.btn1Cont;
      botones.push(boton1);

      if(this.fromElementos.value.btn2Title!=''){
        boton2.id_boton=this.elemento.botones[1].id_boton;
        boton2.id_elemento=this.elemento.botones[1].id_elemento;
        boton2.titlebutton=this.fromElementos.value.btn2Title;
        boton2.typebutton=this.fromElementos.value.btn2Type;
        boton2.contentbutton=this.fromElementos.value.btn2Cont;
        botones.push(boton2);
      }

      elementos.botones=botones;
      this.globals.elementosG.push(elementos);  
      
      for(let i=0;i<this.globals.elementosG.length;i++){
        if(this.globals.elementosG[i].id_elements==elementos.id_elements)
          this.globals.elementosG[i]=elementos;
      }

      this.handleSuccessfulEditTodo(elementos);
      
      /*this.elementoService.updateElementos(elementos).subscribe(response=>{
        for(let i=0;i<this.globals.AllBlocks.length;i++){
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){
            if(this.globals.AllBlocks[i][j].id_block == datosBloque.id_block && this.globals.AllBlocks[i][j].blocktype == datosBloque.blocktype){
              this.globals.AllBlocks[i][j]=datosBloque;
            }
          }
        }
        for(let i=0;i<this.globals.AllBlocks.length;i++){
          for(let j=0;j<this.globals.AllBlocks[i].length;j++){
            console.log(i+","+j+" -> "+this.globals.AllBlocks[i][j].namestate);
          }
        }
      });
      this.handleSuccessfulEditTodo(elementos);
        //.catch(err => console.error(err));*/
    }
     
  }

  handleSuccessfulSaveTodo(datos: InterfazElementosS) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
  }

  handleSuccessfulEditTodo(datos: InterfazElementosS) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
  }




}
