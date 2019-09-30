import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkQR } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BlkQRService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueQR';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueQR/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkQRALL (): Observable<InterfazViewBlkQR[]> {
    return this.http.get<InterfazViewBlkQR[]>(this.DataBaseUrl)
  }

  getBlkQR(id: number): Observable<InterfazViewBlkQR> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkQR>(url);
  }

  getBlk(datos: any): Observable<InterfazViewBlkQR> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkQR>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkQR[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkQR[]>(url);
  }

  addDatosBlkQR (blkQR: InterfazViewBlkQR): Observable<InterfazViewBlkQR> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkQR>(this.DataBaseUrl, blkQR, httpOptions);
  }

  deleteBlkQR(id: any): Observable<InterfazViewBlkQR> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkQR>(url, httpOptions);
  }

  deleteBlkQRBot(id_robot: any): Observable<InterfazViewBlkQR> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkQR>(url, httpOptions);
  }

  updateBlkQR (blkQR: InterfazViewBlkQR): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkQR, httpOptions);
  }
}