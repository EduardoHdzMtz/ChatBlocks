import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazVariables } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}
//148.204.64.142
@Injectable({
  providedIn: 'root'
})
export class variablesService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/variables';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/variables/newVar';
  private DataBaseUrl3 = 'http://148.204.64.142:8081/api/variables/getVars'
  constructor( 
    private http: HttpClient
  ) { }

  getVarALL (): Observable<InterfazVariables[]> {
    return this.http.get<InterfazVariables[]>(this.DataBaseUrl)
  }

  getVar_data(datos: any): Observable<InterfazVariables> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazVariables>(url);
  }

  getVar(id_var: number): Observable<InterfazVariables> {
    const url = `${this.DataBaseUrl}/${id_var}`;
    return this.http.get<InterfazVariables>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazVariables[]> {
    const url = `${this.DataBaseUrl3}/${id_robot}`;
    return this.http.get<InterfazVariables[]>(url);
  }

  addDatosVar (blkinfo: InterfazVariables): Observable<InterfazVariables> {
    return this.http.post<InterfazVariables>(this.DataBaseUrl, blkinfo, httpOptions);
  }

  /*deleteBlkInfo (blkinfo: InterfazVariables | string): Observable<InterfazVariables> {
    const id = typeof blkinfo === 'string' ? blkinfo : blkinfo.id_block;
    const url = `${this.DataBaseUrl}/${id}`;

    return this.http.delete<InterfazVariables>(url, httpOptions);
  }*/

  deleteVar(id: any): Observable<InterfazVariables> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazVariables>(url, httpOptions);
  }

  deleteVars_Bot(id_robot: any): Observable<InterfazVariables> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazVariables>(url, httpOptions);
  }

  updateVar (blkinfo: InterfazVariables): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkinfo, httpOptions);
  }
}