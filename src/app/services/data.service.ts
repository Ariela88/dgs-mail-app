import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Mail } from '../model/mail';
import { FolderService } from './folder.service';
import { Observable, forkJoin, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

mockMail = 'https://651a7a94340309952f0d59cb.mockapi.io/emails'


  getMailMessage(): Observable<Mail[]> {
   console.log('get email data serv')
    return this.http.get<Mail[]>(this.mockMail)
  }

  postMailMessage(email: Mail) {
    return this.http.post<Mail[]>(this.mockMail, email).pipe(
      tap(() => {
       
        console.log(email);
      })
    );
  }


  deleteMail(emailIds: string[]): Observable<void> {
    const deleteUrls = emailIds.map((emailId) => `${this.mockMail}/${emailId}`);
    const deleteRequests = deleteUrls.map((url) => this.http.delete(url));
  
    return forkJoin(deleteRequests).pipe(
      map(() => {
        console.log('Mail cancellata ');
      }),
      catchError((error) => {
        console.error('Errore nella cancellazione della mail:', error);
        return throwError(error);
      })
    );
  }
  




}
