import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazElementosS } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ElementoService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/elementos';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/elementos/newELM';
  constructor( 
    private http: HttpClient
  ) { }

  getElementosALL (): Observable<InterfazElementosS[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<InterfazElementosS[]>(this.DataBaseUrl)
  }

  getElementosDt(datos: any): Observable<InterfazElementosS> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazElementosS>(url);
  }

  getElementos(id: number): Observable<InterfazElementosS> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazElementosS>(url);
  }

  getAll_ByBlock(id_block: string): Observable<InterfazElementosS[]> {
    const url = `${this.DataBaseUrl}/${id_block}`;
    return this.http.get<InterfazElementosS[]>(url);
  }

  addDatosElementos (elementos: InterfazElementosS): Observable<InterfazElementosS> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazElementosS>(this.DataBaseUrl, elementos, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: InterfazViewBlkInfo | string): Observable<InterfazViewBlkInfo> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }*/

  deleteElementos(id: any): Observable<InterfazElementosS> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazElementosS>(url, httpOptions);
  }

  deleteElementosBLK(id_block: any): Observable<InterfazElementosS> {
    const url = `${this.DataBaseUrl2}/${id_block}`;
    return this.http.delete<InterfazElementosS>(url, httpOptions);
  }

  updateElementos (elemento: InterfazElementosS): Observable<any> {
    return this.http.put(this.DataBaseUrl, elemento, httpOptions);
  }
}