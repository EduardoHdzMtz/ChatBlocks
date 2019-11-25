import { Injectable } from "@angular/core";
import { InterfazViewBlkInfo, InterfazViewBlkInput, InterfazChatBot, InterfazElementosS, InterfazViewBlkSlide, InterfazVariables } from './interfaz-view-blk-info';

@Injectable()
export class Globals {
  
    bloquesInfo: InterfazViewBlkInfo[] = [];
    bloquesInput: InterfazViewBlkInput[] = [];
    allNameStates: string[]=[];
    AllBlocks: any[]=[];
    AllChatBots: any[]=[];
    PenultimaEdBlks: any[]=[];
    elementosG: any[]=[];
    bandera_slide_nx: any;
    tabla_vars: InterfazVariables[];
    
    
    RobotSelect: InterfazChatBot; 
    

    //Datos usuario
    //estado: string='out';
    estado: string='in'
    user: any= {email: 'chatbots2.proyecto@gmail.com'};
    //user: any='';

    generar_Id(){
        let contNextArr=0;
        let tam=this.AllBlocks.length;
        let tam2=0;
        let nx_id:string;
        
        for(let i=0;i<(tam-1);i++){
          contNextArr=0;
          tam2=this.AllBlocks[i+1].length;
          for(let j=0;j<this.AllBlocks[i].length;j++){
            nx_id=''; 
            this.AllBlocks[i][j].pos_y=i;
            this.AllBlocks[i][j].pos_x=j;

            if(tam2>0){
              if(((this.AllBlocks[i][j].blocktype=='informativo' || this.AllBlocks[i][j].blocktype=='input' || this.AllBlocks[i][j].blocktype=='informativoDinamico' || this.AllBlocks[i][j].blocktype=='slideDinamico' || this.AllBlocks[i][j].blocktype=='inputDinamico' || this.AllBlocks[i][j].blocktype=='quickReplyDinamico') && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente') || (this.AllBlocks[i][j].blocktype=='slide' && this.AllBlocks[i][j].opc_elm=='Una sola transición' && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente')){
                this.AllBlocks[i][j].next_id= this.AllBlocks[i+1][contNextArr].namestate; 
                contNextArr=this.validarCont(contNextArr, i);
              }
              else if(this.AllBlocks[i][j].blocktype=='slide' && this.AllBlocks[i][j].opc_elm=='Una transición por elemento'){
                for(let cont_e=0;cont_e<this.AllBlocks[i][j].elementos.length;cont_e++)
                  for(let cont_btn=0;cont_btn<this.AllBlocks[i][j].elementos[cont_e].botones.length;cont_btn++)
                    if(this.AllBlocks[i][j].elementos[cont_e].botones[cont_btn].opc_nextid == 'Generar automaticamente'){
                      this.AllBlocks[i][j].elementos[cont_e].botones[cont_btn].contentbutton= this.AllBlocks[i+1][contNextArr].namestate;
                      contNextArr=this.validarCont(contNextArr, i);
                    }
              }
              else if(this.AllBlocks[i][j].blocktype == 'internalProcess'){
                if(this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente'){
                  this.AllBlocks[i][j].default_nextid = this.AllBlocks[i+1][contNextArr].namestate; 
                  contNextArr=this.validarCont(contNextArr, i);
                }
                for(let cont_opc=0; cont_opc<this.AllBlocks[i][j].operaciones.length; cont_opc++){
                  if((this.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'if' || this.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'else') && this.AllBlocks[i][j].operaciones[cont_opc].opc_nextid == 'Generar automaticamente'){
                    this.AllBlocks[i][j].operaciones[cont_opc].next_id = this.AllBlocks[i+1][contNextArr].namestate;
                    contNextArr=this.validarCont(contNextArr, i);                
                  }
                }
              }
              else if(this.AllBlocks[i][j].blocktype=='quickReply'){
                let opc_type=this.AllBlocks[i][j].opc_nextid.split(",");
                let arr_nx=this.AllBlocks[i][j].next_id.split(",");
                for(let x=0;x<(opc_type.length-1);x++){
                  if(opc_type[x]=='Generar automaticamente'){
                    nx_id=nx_id+this.AllBlocks[i+1][contNextArr].namestate+",";              
                    contNextArr=this.validarCont(contNextArr, i);  
                  }
                  else
                    nx_id=nx_id+arr_nx[x]+",";   
                }
                if(opc_type[opc_type.length-1]=='Generar automaticamente'){
                  nx_id=nx_id+this.AllBlocks[i+1][contNextArr].namestate;              
                  contNextArr=this.validarCont(contNextArr, i);
                }
                else
                  nx_id=nx_id+arr_nx[opc_type.length-1];
                this.AllBlocks[i][j].next_id=nx_id;    
              }
              
            }

            else if(i<(tam-2)){
              if(((this.AllBlocks[i][j].blocktype=='informativo' || this.AllBlocks[i][j].blocktype=='input' || this.AllBlocks[i][j].blocktype=='informativoDinamico' || this.AllBlocks[i][j].blocktype=='slideDinamico' || this.AllBlocks[i][j].blocktype=='inputDinamico' || this.AllBlocks[i][j].blocktype=='quickReplyDinamico') && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente') || (this.AllBlocks[i][j].blocktype=='slide' && this.AllBlocks[i][j].opc_elm=='Una sola transición' && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente'))
                this.AllBlocks[i][j].next_id= '';
              else if(this.AllBlocks[i][j].blocktype=='slide' && this.AllBlocks[i][j].opc_elm=='Una transición por elemento'){
                for(let cont_e=0;cont_e<this.AllBlocks[i][j].elementos.length;cont_e++)
                  for(let cont_btn=0;cont_btn<this.AllBlocks[i][j].elementos[cont_e].botones.length;cont_btn++)
                    if(this.AllBlocks[i][j].elementos[cont_e].botones[cont_btn].opc_nextid == 'Generar automaticamente')
                      this.AllBlocks[i][j].elementos[cont_e].botones[cont_btn].contentbutton= '';
              }
              else if(this.AllBlocks[i][j].blocktype == 'internalProcess'){
                if(this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente'){
                  this.AllBlocks[i][j].default_nextid= '';
                }
                for(let cont_opc=0; cont_opc<this.AllBlocks[i][j].operaciones.length; cont_opc++){
                  if((this.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'if' || this.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'else') && this.AllBlocks[i][j].operaciones[cont_opc].opc_nextid == 'Generar automaticamente'){
                    this.AllBlocks[i][j].operaciones[cont_opc].next_id = '';               
                  }
                }
              }              
              else if(this.AllBlocks[i][j].blocktype=='quickReply'){
                let opc_type=this.AllBlocks[i][j].opc_nextid.split(",");
                let arr_nx=this.AllBlocks[i][j].next_id.split(",");
                for(let x=0;x<(opc_type.length-1);x++){
                  if(opc_type[x]=='Generar automaticamente'){
                    nx_id=nx_id+",";
                  }
                  else
                    nx_id=nx_id+arr_nx[x]+",";                              
                }

                if(opc_type[opc_type.length-1]=='Generar automaticamente'){
                  nx_id=nx_id+"";
                }
                else
                  nx_id=nx_id+arr_nx[opc_type.length-1];

                //if(opc_type[opc_type.length-1]=='Seleccionar de la lista')
                  //nx_id=nx_id+arr_nx[opc_type.length-1];
                this.AllBlocks[i][j].next_id=nx_id;

              }
            }
            else{
              for(let y=0;y<(tam-1);y++){
                if(this.AllBlocks[y].length>0){
                  if(((this.AllBlocks[i][j].blocktype=='informativo' || this.AllBlocks[i][j].blocktype=='input' || this.AllBlocks[i][j].blocktype=='informativoDinamico' || this.AllBlocks[i][j].blocktype=='slideDinamico' || this.AllBlocks[i][j].blocktype=='inputDinamico' || this.AllBlocks[i][j].blocktype=='quickReplyDinamico') && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente') || (this.AllBlocks[i][j].blocktype=='slide' && this.AllBlocks[i][j].opc_elm=='Una sola transición' && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente')){
                      this.AllBlocks[i][j].next_id= this.AllBlocks[y][0].namestate; 
                    }
                    else if(this.AllBlocks[i][j].blocktype=='slide' && this.AllBlocks[i][j].opc_elm=='Una transición por elemento'){
                      for(let cont_e=0;cont_e<this.AllBlocks[i][j].elementos.length;cont_e++)
                        for(let cont_btn=0;cont_btn<this.AllBlocks[i][j].elementos[cont_e].botones.length;cont_btn++)
                          if(this.AllBlocks[i][j].elementos[cont_e].botones[cont_btn].opc_nextid == 'Generar automaticamente')
                            this.AllBlocks[i][j].elementos[cont_e].botones[cont_btn].contentbutton= this.AllBlocks[y][0].namestate;
                    }
                    else if(this.AllBlocks[i][j].blocktype == 'internalProcess'){
                      if(this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente'){
                        this.AllBlocks[i][j].default_nextid= this.AllBlocks[y][0].namestate;
                      }
                      for(let cont_opc=0; cont_opc<this.AllBlocks[i][j].operaciones.length; cont_opc++){
                        if((this.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'if' || this.AllBlocks[i][j].operaciones[cont_opc].type_operation == 'else') && this.AllBlocks[i][j].operaciones[cont_opc].opc_nextid == 'Generar automaticamente'){
                          this.AllBlocks[i][j].operaciones[cont_opc].next_id = this.AllBlocks[y][0].namestate;               
                        }
                      }
                    }
                    else if(this.AllBlocks[i][j].blocktype=='quickReply'){
                      let opc_nx=this.AllBlocks[i][j].opc_nextid.split(",");
                      let arr_nx=this.AllBlocks[i][j].next_id.split(",");
                      for(let x=0;x<(opc_nx.length-1);x++){
                        if(opc_nx[x]== 'Generar automaticamente')
                          nx_id=nx_id+this.AllBlocks[y][0].namestate+",";
                        else{
                          nx_id=nx_id+arr_nx[x]+",";
                        }              
                      }

                      if(opc_nx[opc_nx.length-1]=='Generar automaticamente'){
                        nx_id=nx_id+this.AllBlocks[y][0].namestate;
                      }
                      else
                        nx_id=nx_id+arr_nx[opc_nx.length-1];                       
                      
                      this.AllBlocks[i][j].next_id=nx_id;
                    }
                    break;
                }          
              
              }
            }      
          }
        }
        
      }

      validarCont(contNextArr,i){
        if((contNextArr+1)==this.AllBlocks[i+1].length)
          return contNextArr;
        else
          return contNextArr+1;
      }
}