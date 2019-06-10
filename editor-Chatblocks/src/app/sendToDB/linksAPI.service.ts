import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazLinksAPI } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class LinksAPIService {
  private DataBaseUrl = 'http://localhost:8080/api/linksAPI';  // URL to web api
  private DataBaseUrl2 = 'http://localhost:8080/api/linksAPI/newLK';
  private DataBaseUrl3 = 'http://localhost:8080/api/linksAPI/contruccion';
  constructor( 
    private http: HttpClient
  ) { }

  getLinksAPIALL (): Observable<InterfazLinksAPI[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<InterfazLinksAPI[]>(this.DataBaseUrl)
  }

  deleteLk(datos: any): Observable<InterfazLinksAPI> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.delete<InterfazLinksAPI>(url, httpOptions);
  }

  getLinksAPIdatos(datos: any): Observable<InterfazLinksAPI> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazLinksAPI>(url);
  }

  getAll_Bydatos(datos: any): Observable<InterfazLinksAPI[]> {
    const url = `${this.DataBaseUrl3}/${datos}`;
    return this.http.get<InterfazLinksAPI[]>(url);
  }

  getLinksAPI(id: number): Observable<InterfazLinksAPI> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazLinksAPI>(url);
  }

  getAll_ByBlock(id_block: string): Observable<InterfazLinksAPI[]> {
    const url = `${this.DataBaseUrl}/${id_block}`;
    return this.http.get<InterfazLinksAPI[]>(url);
  }

  addDatosLinksAPI (links: InterfazLinksAPI): Observable<InterfazLinksAPI> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazLinksAPI>(this.DataBaseUrl, links, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: InterfazViewBlkInfo | string): Observable<InterfazViewBlkInfo> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }*/

  deleteLinksAPI(id: any): Observable<InterfazLinksAPI> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazLinksAPI>(url, httpOptions);
  }

  deleteLinksAPIBLK(id_block: any): Observable<InterfazLinksAPI> {
    const url = `${this.DataBaseUrl2}/${id_block}`;
    return this.http.delete<InterfazLinksAPI>(url, httpOptions);
  }

  updateLinksAPI (links: InterfazLinksAPI): Observable<any> {
    return this.http.put(this.DataBaseUrl, links, httpOptions);
  }
}