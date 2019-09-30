import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazViewBlkSlideDin } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BlkSlideServiceDin {
  private DataBaseUrl = 'http://148.204.64.142:8081/api/bloqueSlideDinamico';  
  private DataBaseUrl2 = 'http://148.204.64.142:8081/api/bloqueSlideDinamico/newBlk';
  constructor( 
    private http: HttpClient
  ) { }

  getBlkSlideALL (): Observable<InterfazViewBlkSlideDin[]> {
    return this.http.get<InterfazViewBlkSlideDin[]>(this.DataBaseUrl)
  }

  getBlkSlide(id: number): Observable<InterfazViewBlkSlideDin> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazViewBlkSlideDin>(url);
  }

  getBlk(datos: any): Observable<InterfazViewBlkSlideDin> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazViewBlkSlideDin>(url);
  }

  getAll_ByRobot(id_robot: string): Observable<InterfazViewBlkSlideDin[]> {
    const url = `${this.DataBaseUrl}/${id_robot}`;
    return this.http.get<InterfazViewBlkSlideDin[]>(url);
  }

  addDatosBlkSlide (blkSlide: InterfazViewBlkSlideDin): Observable<InterfazViewBlkSlideDin> {
    console.log("Agregar bloque info: "+this.DataBaseUrl);
    return this.http.post<InterfazViewBlkSlideDin>(this.DataBaseUrl, blkSlide, httpOptions);
  }

  deleteBlkSlide(id: any): Observable<InterfazViewBlkSlideDin> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazViewBlkSlideDin>(url, httpOptions);
  }

  deleteBlkSlideBot(id_robot: any): Observable<InterfazViewBlkSlideDin> {
    const url = `${this.DataBaseUrl2}/${id_robot}`;
    return this.http.delete<InterfazViewBlkSlideDin>(url, httpOptions);
  }


  updateBlkSlide (blkSlide: InterfazViewBlkSlideDin): Observable<any> {
    return this.http.put(this.DataBaseUrl, blkSlide, httpOptions);
  }
}