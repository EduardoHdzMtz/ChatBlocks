import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IntefazInternalProcess } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}
//148.204.64.142
@Injectable({
  providedIn: 'root'
})
export class BlkInternalPrs {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueInternalPrs';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueInternalPrs/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkInternalPrsALL (): Observable<IntefazInternalProcess[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<IntefazInternalProcess[]>(this.DataBaseUrl)
  }

  getBlk(datos: any): Observable<IntefazInternalProcess> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<IntefazInternalProcess>(url);
  }

  getBlkInternalPrs(id: number): Observable<IntefazInternalProcess> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<IntefazInternalProcess>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<IntefazInternalProcess[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<IntefazInternalProcess[]>(url);
  }

  addDatosBlkInternalPrs (blkInternalPrs: IntefazInternalProcess): Observable<IntefazInternalProcess> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<IntefazInternalProcess>(this.DataBaseUrl, blkInternalPrs, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: InterfazViewBlkInfo | string): Observable<InterfazViewBlkInfo> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }*/

  deleteBlkInternalPrs(id: any): Observable<IntefazInternalProcess> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<IntefazInternalProcess>(url, httpOptions);
  }

  deleteBlkInternalPrsBot(id_robot: any): Observable<IntefazInternalProcess> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<IntefazInternalProcess>(url, httpOptions);
  }

  updateBlkInternalPrs (blkInternalPrs: IntefazInternalProcess): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkInternalPrs, httpOptions);
  }
}