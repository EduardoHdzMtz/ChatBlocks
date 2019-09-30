import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkInfo } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}
//148.204.64.142
@Injectable({
  providedIn: 'root'
})
export class BlkInfoService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueInfo';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueInfo/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkInfoALL (): Observable<InterfazViewBlkInfo[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<InterfazViewBlkInfo[]>(this.DataBaseUrl)
  }

  getBlk(datos: any): Observable<InterfazViewBlkInfo> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkInfo>(url);
  }

  getBlkInfo(id: number): Observable<InterfazViewBlkInfo> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkInfo>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkInfo[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkInfo[]>(url);
  }

  addDatosBlkInfo (blkinfo: InterfazViewBlkInfo): Observable<InterfazViewBlkInfo> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkInfo>(this.DataBaseUrl, blkinfo, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: InterfazViewBlkInfo | string): Observable<InterfazViewBlkInfo> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }*/

  deleteBlkInfo(id: any): Observable<InterfazViewBlkInfo> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }

  deleteBlkInfoBot(id_robot: any): Observable<InterfazViewBlkInfo> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }

  updateBlkInfo (blkinfo: InterfazViewBlkInfo): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkinfo, httpOptions);
  }
}