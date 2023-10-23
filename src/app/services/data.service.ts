import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, throwError } from 'rxjs';
import { Mail } from '../model/mail';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  mail!:Mail
  mails:Mail[]=[]
  constructor(private http:HttpClient) { }

  getMailMessage(): Observable<Mail[]> {
    return this.http.get<Mail[]>('/assets/mail.json');
  }
  

  getMessageById(id: string): Observable<Mail | null> {
    const foundMail = this.mails.find(mail => mail.id === id);
    if (foundMail) {
      return of(foundMail);
    } else {
      return of(null);
    }
  }
  
  




}
