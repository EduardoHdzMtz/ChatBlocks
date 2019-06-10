import { Component, OnInit } from '@angular/core';
import { Globals } from './general/bloques/interfaces/Globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'editor-Chatblocks';

  tam: any[]=[0,0];

  constructor(public globals: Globals) { }  

  ngOnInit(){
    if (typeof window.innerWidth != 'undefined'){
      this.tam = [window.innerWidth,window.innerHeight];
      console.log("Caso 1-> Ancho: "+this.tam[0]+", largo: "+this.tam[1]);
    }
    else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0)
    {
      this.tam = [
          document.documentElement.clientWidth,
          document.documentElement.clientHeight
      ];
      alert("Caso 2-> Ancho: "+this.tam[0]+", largo: "+this.tam[1]);
    }
    
    let shand = document.getElementsByClassName("general") as HTMLCollectionOf<HTMLElement>;
    shand[0].setAttribute("style", "height: "+this.tam[1]+"px;");

    let shand2 = document.getElementsByClassName("lienzoG") as HTMLCollectionOf<HTMLElement>;
    shand2[0].setAttribute("style", "height: "+this.tam[1]+"px;");
    

  }

  

  tamPantalla(){
    //let shand = document.getElementsByClassName("general") as HTMLCollectionOf<HTMLElement>;
    //shand[0].setAttribute("style", "width: 100%; height: 800px; margin: auto; background-color: red;");
    

    if (typeof window.innerWidth != 'undefined'){
      this.tam = [window.innerWidth,window.innerHeight];
      console.log("Caso 1-> Ancho: "+this.tam[0]+", largo: "+this.tam[1]);
    }
    else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0)
    {
      this.tam = [
          document.documentElement.clientWidth,
          document.documentElement.clientHeight
      ];
      alert("Caso 2-> Ancho: "+this.tam[0]+", largo: "+this.tam[1]);
    }

    var div_general= document.getElementsByClassName("general");

    let shand = document.getElementsByClassName("general") as HTMLCollectionOf<HTMLElement>;
    shand[0].setAttribute("style", "height: "+this.tam[1]+"px;");
  }
  
}
