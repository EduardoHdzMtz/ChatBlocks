import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkInputDin } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BlkInputServiceDin {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueInputDinamico';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueInputDinamico/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkInputALL (): Observable<InterfazViewBlkInputDin[]> {
    return this.http.get<InterfazViewBlkInputDin[]>(this.DataBaseUrl)
  }

  getBlkInput(id: number): Observable<InterfazViewBlkInputDin> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkInputDin>(url);
  }

  getBlk(datos: any): Observable<InterfazViewBlkInputDin> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkInputDin>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkInputDin[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkInputDin[]>(url);
  }

  addDatosBlkInput (blkinput: InterfazViewBlkInputDin): Observable<InterfazViewBlkInputDin> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkInputDin>(this.DataBaseUrl, blkinput, httpOptions);
  }

  deleteBlkInput(id: any): Observable<InterfazViewBlkInputDin> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkInputDin>(url, httpOptions);
  }

  deleteBlkInputBot(id_robot: any): Observable<InterfazViewBlkInputDin> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkInputDin>(url, httpOptions);
  }

  updateBlkInput (blkinput: InterfazViewBlkInputDin): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkinput, httpOptions);
  }
}