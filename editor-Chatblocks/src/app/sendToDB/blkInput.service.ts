import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkInput } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BlkInputService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueInput';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueInput/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkInputALL (): Observable<InterfazViewBlkInput[]> {
    return this.http.get<InterfazViewBlkInput[]>(this.DataBaseUrl)
  }

  getBlkInput(id: number): Observable<InterfazViewBlkInput> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkInput>(url);
  }

  getBlk(datos: any): Observable<InterfazViewBlkInput> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkInput>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkInput[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkInput[]>(url);
  }

  addDatosBlkInput (blkinput: InterfazViewBlkInput): Observable<InterfazViewBlkInput> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkInput>(this.DataBaseUrl, blkinput, httpOptions);
  }

  deleteBlkInput(id: any): Observable<InterfazViewBlkInput> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkInput>(url, httpOptions);
  }

  deleteBlkInputBot(id_robot: any): Observable<InterfazViewBlkInput> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkInput>(url, httpOptions);
  }

  updateBlkInput (blkinput: InterfazViewBlkInput): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkinput, httpOptions);
  }
}