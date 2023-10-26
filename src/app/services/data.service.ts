import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Mail } from '../model/mail';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  mails: Mail[] = [];
  private sentMailSubject = new BehaviorSubject<Mail | null>(null);
  sentMail$ = this.sentMailSubject.asObservable();
  private allMailSubject = new Subject<Mail[]>();
  public allMail$ = this.allMailSubject.asObservable();
  sentEmails: Mail[] = [];

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
    console.log('dataServ send')
    this.sentEmails.push(mail);
    this.sentMailSubject.next(mail);
  }
}
