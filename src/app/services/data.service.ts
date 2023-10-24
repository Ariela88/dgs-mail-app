import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Mail } from '../model/mail';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  jsonmail!: Mail;
  mails: Mail[] = [];
  private sentMailSubject = new BehaviorSubject<Mail | null>(null);
  sentMail$ = this.sentMailSubject.asObservable();
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
}
