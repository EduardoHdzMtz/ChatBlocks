import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IntefazOperaciones } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}
//148.204.64.142
@Injectable({
  providedIn: 'root'
})
export class OperacionesService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/operaciones';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/operaciones/newOpc';
  constructor( 
    private http: HttpClient
  ) { }

  getOpcALL (): Observable<IntefazOperaciones[]> {
    return this.http.get<IntefazOperaciones[]>(this.DataBaseUrl)
  }

  getOpc_data(datos: any): Observable<IntefazOperaciones> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<IntefazOperaciones>(url);
  }

  getOpc(id: number): Observable<IntefazOperaciones> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<IntefazOperaciones>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<IntefazOperaciones[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<IntefazOperaciones[]>(url);
  }

  addDatosOpc (operacion: IntefazOperaciones): Observable<IntefazOperaciones> {
    return this.http.post<IntefazOperaciones>(this.DataBaseUrl, operacion, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: IntefazOperaciones | string): Observable<IntefazOperaciones> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<IntefazOperaciones>(url, httpOptions);
  }*/

  deleteOpc(id: any): Observable<IntefazOperaciones> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<IntefazOperaciones>(url, httpOptions);
  }

  deleteOpcs_Bot(id_robot: any): Observable<IntefazOperaciones> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<IntefazOperaciones>(url, httpOptions);
  }

  updateOpc (operacion: IntefazOperaciones): Observable<any> {
    return this.http.put(this.DataBaseUrl, operacion, httpOptions);
  }
}