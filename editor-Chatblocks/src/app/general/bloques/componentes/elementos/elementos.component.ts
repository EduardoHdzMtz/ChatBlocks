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

    if(this.globals.bandera_slide_nx == 'Una transición por elemento'){
      this.fromElementos=this.formBuilder.group({
        title: ['', Validators.required],
        subtitle: ['', Validators.required],
        image_url: ['',Validators.required],
        btn1Title: ['', Validators.required],
        btn1Type: ['postback', Validators.required],
        opc_nextid1: [''],
        btn1Cont: [''],
        btn2Title: [''],
        btn2Type: [''],
        opc_nextid2: [''],
        btn2Cont: ['']
      });
    }
    else{
      this.fromElementos=this.formBuilder.group({
        title: ['', Validators.required],
        subtitle: ['', Validators.required],
        image_url: ['',Validators.required],
        btn1Title: ['', Validators.required],
        btn1Type: ['', Validators.required],
        opc_nextid1: [''],
        btn1Cont: [''],
        btn2Title: [''],
        btn2Type: [''],
        opc_nextid2: [''],
        btn2Cont: ['']
      });
    }

    

    if (!this.createMode) {
      this.loadBloque(this.elemento); 
    }
  }

  loadBloque(elemento){
    console.log("TITULO ELM-> "+ elemento.title);
    console.log("BOTON-> ");
    console.log("TITULO-> "+ elemento.botones[0].titlebutton);
    //this.fromElementos.patchValue(elemento);
    let elemento_copia: any;
    if(this.globals.bandera_slide_nx == 'Una transición por elemento'){
      elemento_copia={
        title: elemento.title,
        subtitle: elemento.subtitle,
        image_url: elemento.image_url,
        btn1Title: elemento.botones[0].titlebutton,
        btn1Type: 'postback',
        opc_nextid1: elemento.botones[0].opc_nextid,
        btn1Cont: elemento.botones[0].contentbutton,
        btn2Title: '',
        btn2Type: '',
        opc_nextid2: '',
        btn2Cont: ''
      }
    }
    else{
      elemento_copia={
        title: elemento.title,
        subtitle: elemento.subtitle,
        image_url: elemento.image_url,
        btn1Title: elemento.botones[0].titlebutton,
        btn1Type: elemento.botones[0].typebutton,
        opc_nextid1: elemento.botones[0].opc_nextid,
        btn1Cont: elemento.botones[0].contentbutton,
        btn2Title: '',
        btn2Type: '',
        opc_nextid2: '',
        btn2Cont: ''
      }

    }

    if(elemento.botones.length == 2)
      this.cargar_Datos_btn2(elemento_copia, elemento.botones[1]);
    else
      this.fromElementos.patchValue(elemento_copia);



  }

  cargar_Datos_btn2(elemento_copia: any, boton_2: any){
    elemento_copia.btn2Title=boton_2.titlebutton;
    elemento_copia.btn2Type=boton_2.typebutton;
    elemento_copia.opc_nextid2=boton_2.opc_nextid;
    elemento_copia.btn2Cont=boton_2.contentbutton;
    this.fromElementos.patchValue(elemento_copia);
  }

  saveElemento(){

    if(this.validar_datos()){  
      if (this.fromElementos.invalid) {
        return;
      }
      
      if (this.createMode){
        let elementos: InterfazElementosS= this.fromElementos.value;
        let botones: any[]=[];
        elementos.id_elements='sin almacenar';
        elementos.id_block='sin almacenar';
        elementos.blocktype='slide';

        let boton1={
          id_boton:'sin almacenar',
          id_elemento:'sin almacenar',
          titlebutton:this.fromElementos.value.btn1Title,
          typebutton:this.fromElementos.value.btn1Type,
          opc_nextid:this.fromElementos.value.opc_nextid1,
          contentbutton:this.fromElementos.value.btn1Cont
        };

        botones.push(boton1);

        if(this.fromElementos.value.btn2Title!=''){

          let boton2={
            id_boton:'sin almacenar',
            id_elemento:'sin almacenar',
            titlebutton:this.fromElementos.value.btn2Title,
            typebutton:this.fromElementos.value.btn2Type,
            opc_nextid:this.fromElementos.value.opc_nextid2,
            contentbutton:this.fromElementos.value.btn2Cont
          }

          botones.push(boton2);
        }
        elementos.botones=botones;
        this.globals.elementosG.push(elementos);
        this.handleSuccessfulSaveTodo(elementos);

      } else{
        let elementos: InterfazElementosS= this.fromElementos.value;
        let botones: any[]=[];
        
        elementos.id_elements=this.elemento.id_elements;
        elementos.id_block=this.elemento.id_block;
        elementos.blocktype='slide';

        let boton1={
          id_boton:this.elemento.botones[0].id_boton,
          id_elemento:this.elemento.id_elements,
          titlebutton:this.fromElementos.value.btn1Title,
          typebutton:this.fromElementos.value.btn1Type,
          opc_nextid:this.fromElementos.value.opc_nextid1,
          contentbutton:this.fromElementos.value.btn1Cont
        };

        console.log('Boton 2-> '+boton1.titlebutton);
        botones.push(boton1);
        //botones[0]=boton1;
        

        if(this.fromElementos.value.btn2Title!='' && this.elemento.botones.length ==1){

          let boton2={
            id_boton:'sin almacenar',
            id_elemento:this.elemento.id_elements,
            titlebutton:this.fromElementos.value.btn2Title,
            typebutton:this.fromElementos.value.btn2Type,
            opc_nextid:this.fromElementos.value.opc_nextid2,
            contentbutton:this.fromElementos.value.btn2Cont
          }
          console.log('Boton 2-> '+boton2.titlebutton);

          botones.push(boton2);
        }
        else if(this.fromElementos.value.btn2Title!='' && this.elemento.botones.length ==2){

          let boton2={
            id_boton:'sin almacenar',
            id_elemento:this.elemento.botones[1].id_boton,
            titlebutton:this.fromElementos.value.btn2Title,
            typebutton:this.fromElementos.value.btn2Type,
            opc_nextid:this.fromElementos.value.opc_nextid2,
            contentbutton:this.fromElementos.value.btn2Cont
          }
          console.log('Boton 2-> '+boton2.titlebutton);

          botones.push(boton2);
        }

        elementos.botones=botones;       
        
        for(let i=0;i<this.globals.elementosG.length;i++)
          if(this.globals.elementosG[i].id_elements == elementos.id_elements && this.elemento.title == this.globals.elementosG[i].title)
            this.globals.elementosG[i]=elementos;
        

        this.handleSuccessfulEditTodo(elementos);
        
      
      }
    }
    else
      alert("Todos los campos deben ser llenados");
     
  }

  validar_datos(){
    if(this.globals.bandera_slide_nx == 'Una transición por elemento'){
      if((this.fromElementos.value.btn1Cont == '' && this.fromElementos.value.opc_nextid1 != 'Generar automaticamente') || (this.fromElementos.value.btn2Cont == '' && this.fromElementos.value.btn2Title != '' && this.fromElementos.value.opc_nextid2 != 'Generar automaticamente' && this.fromElementos.value.btn2Type == 'postback') || (this.fromElementos.value.btn2Type == 'web_url' && this.fromElementos.value.btn2Cont == ''))
        return false;
      if((this.fromElementos.value.btn1Type == 'postback' && this.fromElementos.value.opc_nextid1 == '') || (this.fromElementos.value.btn2Title != '' && this.fromElementos.value.btn2Type == 'postback' && this.fromElementos.value.opc_nextid2 == ''))
        return false;      
    }
    else{
      if(this.fromElementos.value.btn1Cont == '' || (this.fromElementos.value.btn2Cont == '' && this.fromElementos.value.btn2Title != ''))
        return false;
    }  

    return true;
  }
  

  control_required(){
    let pos_boton = document.getElementById("btn1Cont");
    
    if(this.fromElementos.value.opc_nextid1=='Generar automaticamente')
      pos_boton.removeAttribute("required");
    else if(this.fromElementos.value.opc_nextid1=='Seleccionar de la lista')
      pos_boton.setAttribute("required","");
  }

  handleSuccessfulSaveTodo(datos: InterfazElementosS) {
    this.activeModal.dismiss({ datos: datos, id: datos.id_block, createMode: true });
  }

  handleSuccessfulEditTodo(datos: InterfazElementosS) {
    this.activeModal.dismiss({  datos: datos, id: datos.id_block, createMode: false });
  }




}
