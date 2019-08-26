import { Injectable } from "@angular/core";
import { InterfazViewBlkInfo, InterfazViewBlkInput, InterfazChatBot, InterfazElementosS, InterfazViewBlkSlide } from './interfaz-view-blk-info';

@Injectable()
export class Globals {
  
    bloquesInfo: InterfazViewBlkInfo[] = [];
    bloquesInput: InterfazViewBlkInput[] = [];
    allNameStates: string[]=[];
    AllBlocks: any[]=[];
    AllChatBots: any[]=[];
    PenultimaEdBlks: any[]=[];
    elementosG: any[]=[];
    
    
    RobotSelect: InterfazChatBot; 
    

    //Datos usuario
    estado: string='in'
    //estado: string='interfaz'
    user: any= {email: 'chatbots.proyecto@gmail.com'};
    //user: any='';

    generar_Id(){
        //console.log("generar Id global");
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
            //if(j<=(tam)){


            if(tam2>0){              
                
    
              if((this.AllBlocks[i][j].blocktype=='informativo' || this.AllBlocks[i][j].blocktype=='input' || this.AllBlocks[i][j].blocktype=='informativoDinamico' || this.AllBlocks[i][j].blocktype=='slideDinamico' || this.AllBlocks[i][j].blocktype=='inputDinamico' || this.AllBlocks[i][j].blocktype=='quickReplyDinamico') && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente'){
                this.AllBlocks[i][j].next_id= this.AllBlocks[i+1][contNextArr].namestate; 
                //console.log("Bloque: "+this.AllBlocks[i][j].namestate+", next_id: "+this.AllBlocks[i][j].next_id+", pos_y: "+this.AllBlocks[i][j].pos_y+", pos_x: "+this.AllBlocks[i][j].pos_x); 
                contNextArr=this.validarCont(contNextArr, i);
              }    
    
              else if(this.AllBlocks[i][j].blocktype=='quickReply'){
                
                //let opc=this.AllBlocks[i][j].opciones.split(",");
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
                //console.log("Bloque: "+this.AllBlocks[i][j].namestate+", next_id: "+this.AllBlocks[i][j].next_id+", pos_y: "+this.AllBlocks[i][j].pos_y+", pos_x: "+this.AllBlocks[i][j].pos_x);  
    
              }
              
            } 


            else if(i<(tam-2)){
              if((this.AllBlocks[i][j].blocktype=='informativo' || this.AllBlocks[i][j].blocktype=='input' || this.AllBlocks[i][j].blocktype=='informativoDinamico' || this.AllBlocks[i][j].blocktype=='slideDinamico' || this.AllBlocks[i][j].blocktype=='inputDinamico' || this.AllBlocks[i][j].blocktype=='quickReplyDinamico') && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente')
                this.AllBlocks[i][j].next_id= '';
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
                this.AllBlocks[i][j].next_id=nx_id;

              }
              //console.log("Bloque: "+this.AllBlocks[i][j].namestate+", next_id: "+this.AllBlocks[i][j].next_id+", pos_y: "+this.AllBlocks[i][j].pos_y+", pos_x: "+this.AllBlocks[i][j].pos_x);
            }
            else{
              for(let y=0;y<(tam-1);y++){
                if(this.AllBlocks[y].length>0){
                    if((this.AllBlocks[i][j].blocktype=='informativo' || this.AllBlocks[i][j].blocktype=='input' || this.AllBlocks[i][j].blocktype=='informativoDinamico' || this.AllBlocks[i][j].blocktype=='slideDinamico' || this.AllBlocks[i][j].blocktype=='inputDinamico' || this.AllBlocks[i][j].blocktype=='quickReplyDinamico') && this.AllBlocks[i][j].opc_nextid== 'Generar automaticamente'){
                      this.AllBlocks[i][j].next_id= this.AllBlocks[y][0].namestate; 
                      //console.log("Bloque: "+this.AllBlocks[i][j].namestate+", next_id: "+this.AllBlocks[i][j].next_id+", pos_y: "+this.AllBlocks[i][j].pos_y+", pos_x: "+this.AllBlocks[i][j].pos_x); 
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
                      //console.log("Bloque: "+this.AllBlocks[i][j].namestate+", next_id: "+this.AllBlocks[i][j].next_id+", pos_y: "+this.AllBlocks[i][j].pos_y+", pos_x: "+this.AllBlocks[i][j].pos_x); 
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