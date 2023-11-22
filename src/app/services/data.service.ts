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
  loading = false;
  loadingCounter = 0

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  private startLoading() {
    if (this.loadingCounter === 0) {
      this.loading = true;
    }
    this.loadingCounter++;
  }

  private stopLoading() {
    this.loadingCounter--;
    if (this.loadingCounter === 0) {
      this.loading = false;
    }
  }

  getMailMessage(): Observable<Mail[]> {
    this.startLoading();
   
    return this.http.get<Mail[]>(this.mockMail).pipe(
      finalize(() => {
        
        this.stopLoading();
      })
    );
  }
  

  postMailMessage(email: Mail): Observable<Mail> {
    this.startLoading();
     
    return this.http.post<Mail>(this.mockMail, email).pipe(
      tap((response) => {
               console.log(response);
      }),
      catchError((error) => {
        this.snackBar.open("Errore durante l'invio dell'email", 'Chiudi', {
          duration: 2000,
          panelClass: 'errore-snackbar',
        });
  
        console.error('Error saving email:', error);
        return throwError(error);
      }),
      finalize(() => {
         this.stopLoading();
         this.snackBar.open("Email inviata con successo", 'Chiudi', {
          duration: 2000,
          panelClass: 'errore-snackbar',
        });
      })
    );
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
        console.log('Mail cancellata dal server',deleteUrls,this.deleteMail);
      }),
      catchError((error) => {
        console.error('Errore nella cancellazione della mail dal server:', error);
        return throwError(error);
      })
    );
  }








}



