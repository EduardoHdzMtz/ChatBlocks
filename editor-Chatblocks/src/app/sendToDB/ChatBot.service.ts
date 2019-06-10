import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfazChatBot } from '../general/bloques/interfaces/interfaz-view-blk-info';

const httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private DataBaseUrl = 'http://localhost:8080/api/chatbotsDB';  // URL to web api
  private DataBaseUrl2 = 'http://localhost:8080/api/chatbotsDB/new';
  constructor( 
    private http: HttpClient
  ) { }

  getBotALL (): Observable<InterfazChatBot[]> {
    console.log("Obtener todo de bloque info: "+this.DataBaseUrl);
    return this.http.get<InterfazChatBot[]>(this.DataBaseUrl)
  }

  getBot(datos: any): Observable<InterfazChatBot> {
    const url = `${this.DataBaseUrl2}/${datos}`;
    return this.http.get<InterfazChatBot>(url);
  }

  getBotByID(id: number): Observable<InterfazChatBot> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.get<InterfazChatBot>(url);
  }

  getAll_ByUser(id_user: string): Observable<InterfazChatBot[]> {
    const url = `${this.DataBaseUrl}/${id_user}`;
    return this.http.get<InterfazChatBot[]>(url);
  }

  addDatosBot (bot: InterfazChatBot): Observable<InterfazChatBot> {
    return this.http.post<InterfazChatBot>(this.DataBaseUrl, bot, httpOptions);
  }

  deleteBot(id: any): Observable<InterfazChatBot> {
    const url = `${this.DataBaseUrl}/${id}`;
    return this.http.delete<InterfazChatBot>(url, httpOptions);
  }

  updateBot (bot: InterfazChatBot): Observable<any> {
    return this.http.put(this.DataBaseUrl, bot, httpOptions);
  }
}