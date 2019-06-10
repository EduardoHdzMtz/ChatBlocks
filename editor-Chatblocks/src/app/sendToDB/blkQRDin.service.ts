import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkQRDin } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BlkQRServiceDin {
  private DataBaseUrl = 'http://localhost:8080/api/bloqueQRDinamico';  // URL to web api
  private DataBaseUrl2 = 'http://localhost:8080/api/bloqueQRDinamico/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkQRALL (): Observable<InterfazViewBlkQRDin[]> {
    return this.http.get<InterfazViewBlkQRDin[]>(this.DataBaseUrl)
  }

  getBlkQR(id: number): Observable<InterfazViewBlkQRDin> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkQRDin>(url);
  }

  getBlk(datos: any): Observable<InterfazViewBlkQRDin> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkQRDin>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkQRDin[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkQRDin[]>(url);
  }

  addDatosBlkQR (blkQR: InterfazViewBlkQRDin): Observable<InterfazViewBlkQRDin> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkQRDin>(this.DataBaseUrl, blkQR, httpOptions);
  }

  deleteBlkQR(id: any): Observable<InterfazViewBlkQRDin> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkQRDin>(url, httpOptions);
  }

  deleteBlkQRBot(id_robot: any): Observable<InterfazViewBlkQRDin> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkQRDin>(url, httpOptions);
  }

  updateBlkQR (blkQR: InterfazViewBlkQRDin): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkQR, httpOptions);
  }
}