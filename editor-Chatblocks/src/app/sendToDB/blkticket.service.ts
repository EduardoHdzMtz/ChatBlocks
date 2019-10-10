import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkTicket } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BlkTicketService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueTicket';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueTicket/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkTicketALL (): Observable<InterfazViewBlkTicket[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<InterfazViewBlkTicket[]>(this.DataBaseUrl)
  }

  getBlk(datos: any): Observable<InterfazViewBlkTicket> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkTicket>(url);
  }

  getBlkTicket(id: number): Observable<InterfazViewBlkTicket> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkTicket>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkTicket[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkTicket[]>(url);
  }

  addDatosBlkTicket (blkticket: InterfazViewBlkTicket): Observable<InterfazViewBlkTicket> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkTicket>(this.DataBaseUrl, blkticket, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: InterfazViewBlkInfo | string): Observable<InterfazViewBlkInfo> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazViewBlkInfo>(url, httpOptions);
  }*/

  deleteBlkTicket(id: any): Observable<InterfazViewBlkTicket> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkTicket>(url, httpOptions);
  }

  deleteBlkTicketBot(id_robot: any): Observable<InterfazViewBlkTicket> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkTicket>(url, httpOptions);
  }

  updateBlkTicket (blkticket: InterfazViewBlkTicket): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkticket, httpOptions);
  }
}