import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkInfoDin } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BlkInfoServiceDin {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueInfoDinamico';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueInfoDinamico/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkInfoALL (): Observable<InterfazViewBlkInfoDin[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<InterfazViewBlkInfoDin[]>(this.DataBaseUrl)
  }

  getBlk(datos: any): Observable<InterfazViewBlkInfoDin> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkInfoDin>(url);
  }

  getBlkInfo(id: number): Observable<InterfazViewBlkInfoDin> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkInfoDin>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkInfoDin[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkInfoDin[]>(url);
  }

  addDatosBlkInfo (blkinfo: InterfazViewBlkInfoDin): Observable<InterfazViewBlkInfoDin> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkInfoDin>(this.DataBaseUrl, blkinfo, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: InterfazViewBlkInfo | string): Observable<InterfazViewBlkInfo> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }*/

  deleteBlkInfo(id: any): Observable<InterfazViewBlkInfoDin> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkInfoDin>(url, httpOptions);
  }

  deleteBlkInfoBot(id_robot: any): Observable<InterfazViewBlkInfoDin> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkInfoDin>(url, httpOptions);
  }

  updateBlkInfo (blkinfo: InterfazViewBlkInfoDin): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkinfo, httpOptions);
  }
}