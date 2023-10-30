import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import { Mail } from '../model/mail';


@Injectable({
  providedIn: 'root',
})
export class DataService {

  mailJson = JSON.parse(JSON.stringify('/assets/mail.json'));
  originalData = JSON.parse(JSON.stringify(this.mailJson));
  
  private sentMailSubject = new BehaviorSubject<Mail | null>(null);
  sentMail$ = this.sentMailSubject.asObservable();
  private allMailSubject = new Subject<Mail[]>();
  public allMail$ = this.allMailSubject.asObservable();
  sentEmails: Mail[] = [];

  constructor(private http: HttpClient) {}



  getMailMessage(): Observable<Mail[]> {
    return this.http.get<Mail[]>(this.mailJson).pipe(
      tap((data) => {
        console.log('Dati email ricevuti:', data);
        this.allMailSubject.next(data);
      })
    );
  }
  
  

  sendMail(mail: Mail) {
    console.log(mail,'dataServ send')
    
    
  }

  

  
  
}
