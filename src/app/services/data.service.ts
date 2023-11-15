import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Mail } from '../model/mail';
import { Observable, forkJoin, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  
  mockMail = 'https://651a7a94340309952f0d59cb.mockapi.io/emails'

  constructor(private http: HttpClient) {}

 getMailMessage(): Observable<Mail[]> {
   console.log('get email data serv')
    return this.http.get<Mail[]>(this.mockMail)
     }

  postMailMessage(email: Mail): Observable<Mail> {
    return this.http.post<Mail>(this.mockMail, email).pipe(
      tap((response) => {
        console.log('Email saved successfully:', response);
         }),
          catchError((error) => {
           console.error('Error saving email:', error);
            return throwError(error);
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
