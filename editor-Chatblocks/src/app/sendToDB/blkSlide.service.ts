import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkSlide } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BlkSlideService {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueSlide';  // URL to web api
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueSlide/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkSlideALL (): Observable<InterfazViewBlkSlide[]> {
    return this.http.get<InterfazViewBlkSlide[]>(this.DataBaseUrl)
  }

  getBlkSlide(id: number): Observable<InterfazViewBlkSlide> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkSlide>(url);
  }

  getBlk(datos: any): Observable<InterfazViewBlkSlide> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkSlide>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkSlide[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkSlide[]>(url);
  }

  addDatosBlkSlide (blkSlide: InterfazViewBlkSlide): Observable<InterfazViewBlkSlide> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkSlide>(this.DataBaseUrl, blkSlide, httpOptions);
  }

  deleteBlkSlide(id: any): Observable<InterfazViewBlkSlide> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkSlide>(url, httpOptions);
  }

  deleteBlkSlideBot(id_robot: any): Observable<InterfazViewBlkSlide> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkSlide>(url, httpOptions);
  }


  updateBlkSlide (blkSlide: InterfazViewBlkSlide): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkSlide, httpOptions);
  }
}