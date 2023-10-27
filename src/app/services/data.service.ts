import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Mail } from '../model/mail';


@Injectable({
  providedIn: 'root',
})
export class DataService {

  mailJson = '/assets/mail.json'
  
  
  private sentMailSubject = new BehaviorSubject<Mail | null>(null);
  sentMail$ = this.sentMailSubject.asObservable();
  private allMailSubject = new Subject<Mail[]>();
  public allMail$ = this.allMailSubject.asObservable();
  sentEmails: Mail[] = [];

  constructor(private http: HttpClient) {}



  getMailMessage(): Observable<Mail[]> {
    return this.http.get<Mail[]>(this.mailJson);
  }

  sendMail(mail: Mail) {
    console.log(mail,'dataServ send')
    
    
  }

  

  
  
}
