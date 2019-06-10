import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazBotones } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BotonesService {
  private DataBaseUrl = 'http://localhost:8080/api/botones';  // URL to web api
  private DataBaseUrl2 = 'http://localhost:8080/api/botones/newBTN';
  constructor( 
    private http: HttpClient
  ) { }

  getBotonesALL (): Observable<InterfazBotones[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<InterfazBotones[]>(this.DataBaseUrl)
  }

  getBotonDt(datos: any): Observable<InterfazBotones> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazBotones>(url);
  }

  getBotones(id: number): Observable<InterfazBotones> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazBotones>(url);
  }

  getAll_ByELM(id_elmento: string): Observable<InterfazBotones[]> {
    const url = `${this.DataBaseUrl}/${id_elmento}`;
    return this.http.get<InterfazBotones[]>(url);
  }

  addDatosBoton (botones: InterfazBotones): Observable<InterfazBotones> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazBotones>(this.DataBaseUrl, botones, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: InterfazViewBlkInfo | string): Observable<InterfazViewBlkInfo> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }*/

  deleteBoton(id: any): Observable<InterfazBotones> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazBotones>(url, httpOptions);
  }

  deleteBotonELM(id_elmento: any): Observable<InterfazBotones> {
    const url = `${this.DataBaseUrl2}/${id_elmento}`;
    return this.http.delete<InterfazBotones>(url, httpOptions);
  }

  updateBoton (botones: InterfazBotones): Observable<any> {
    return this.http.put(this.DataBaseUrl, botones, httpOptions);
  }
}