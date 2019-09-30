import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazCredencialesAPI } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class CredencialAPIService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/credencialesAPI';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/credencialesAPI/newCD';
  private DataBaseUrl3 = 'http://148.204.64.142:8081/api/linksAPI/contruccion';
  constructor( 
    private http: HttpClient
  ) { }

  getCredencialAPIALL (): Observable<InterfazCredencialesAPI[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<InterfazCredencialesAPI[]>(this.DataBaseUrl)
  }

  getCredencialAPIdatos(datos: any): Observable<InterfazCredencialesAPI> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazCredencialesAPI>(url);
  }

  getCredencialAPI(id: number): Observable<InterfazCredencialesAPI> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazCredencialesAPI>(url);
  }

  getAll_ByBlock(id_block: string): Observable<InterfazCredencialesAPI[]> {
    const url = `${this.DataBaseUrl}/${id_block}`;
    return this.http.get<InterfazCredencialesAPI[]>(url);
  }

  addDatosCredencialAPI (credencial: InterfazCredencialesAPI): Observable<InterfazCredencialesAPI> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazCredencialesAPI>(this.DataBaseUrl, credencial, httpOptions);
  }

  getAll_Bydatos(datos: any): Observable<InterfazCredencialesAPI[]> {
    const url = `${this.DataBaseUrl3}/${datos}`;
    return this.http.get<InterfazCredencialesAPI[]>(url);
  }

  /*deleteBlkInfo (blkinfo: InterfazViewBlkInfo | string): Observable<InterfazViewBlkInfo> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }*/

  deleteCredencialAPI(id: any): Observable<InterfazCredencialesAPI> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazCredencialesAPI>(url, httpOptions);
  }

  deleteCredencialAPIBLK(id_block: any): Observable<InterfazCredencialesAPI> {
    const url = `${this.DataBaseUrl2}/${id_block}`;
    return this.http.delete<InterfazCredencialesAPI>(url, httpOptions);
  }

  updateCredencialAPI (credencial: InterfazCredencialesAPI): Observable<any> {
    return this.http.put(this.DataBaseUrl, credencial, httpOptions);
  }
}