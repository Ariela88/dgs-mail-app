import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Mail } from '../model/mail';
import { Observable, forkJoin, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  mockMail = 'https://651a7a94340309952f0d59cb.mockapi.io/emails';
  emails: Mail[] = [];
  private loading = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getMailMessage(): Observable<Mail[]> {
    console.log('get email data serv');
    return this.http.get<Mail[]>(this.mockMail);
  }

  postMailMessage(email: Mail): Observable<Mail> {
    this.loading = true;
    const invioSnackbarRef = this.snackBar.open(
      'Invio email in corso...',
      'Chiudi',
      {
        duration: 2000,
      }
    );

    return this.http.post<Mail>(this.mockMail, email).pipe(
      tap((response) => {
        invioSnackbarRef.dismiss();
        this.snackBar.open('Email inviata con successo', 'Chiudi', {
          duration: 2000,
        });
        console.log(response, '');
      }),
      catchError((error) => {
        invioSnackbarRef.dismiss();
        this.snackBar.open("Errore durante l'invio dell'email", 'Chiudi', {
          duration: 2000,
          panelClass: 'errore-snackbar',
        });

        console.error('Error saving email:', error);
        return throwError(error);
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  }

  isLoading() {
    return this.isLoading;
  }

  putMailMessage(email: Mail): Observable<Mail> {
    return this.http
      .put<Mail>(`${this.mockMail}/${email.id}`, email)
      .pipe(tap((data) => console.log('email modificata', data)));
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
