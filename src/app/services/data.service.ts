import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Mail } from '../model/mail';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  
jsonMail = ('/assets/mail.json')
  mails: Mail[] = [];
  private sentMailSubject = new BehaviorSubject<Mail | null>(null);
  sentMail$ = this.sentMailSubject.asObservable();
  private allMailSubject = new Subject<Mail[]>();
public allMail$ = this.allMailSubject.asObservable();


  constructor(private http: HttpClient) {}





  getMailMessage(): Observable<Mail[]> {
    return this.http.get<Mail[]>('/assets/mail.json');
  }

  getMessageById(id: string): Observable<Mail | null> {
    return this.http
      .get<Mail[]>('/assets/mail.json')
      .pipe(map((mails) => mails.find((mail) => mail.id === id) || null));
  }



  sendMail(mail: Mail) {
    this.sentMailSubject.next(mail);
  }

  searchMail(searchTerm: string): Observable<Mail[]> {
    return this.http.get<Mail[]>('/assets/mail.json').pipe(
      map((mails: Mail[]) => {
        return mails.filter(mail =>
          mail.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mail.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }
  
  
  }

