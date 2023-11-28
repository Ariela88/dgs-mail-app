import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, concatMap, delay, finalize, map, take, tap } from 'rxjs/operators';
import { Mail } from '../model/mail';
import { EMPTY, Observable, forkJoin, of, throwError, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})

export class DataService {

  mockMail = 'https://651a7a94340309952f0d59cb.mockapi.io/emails';
  emails: Mail[] = [];
  loading = false;
  loadingCounter = 0
  isDraft = false

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {}



  private startLoading(requestCount: number = 1) {
    if (this.loadingCounter === 0) {
      this.loading = true;
    }
    this.loadingCounter += requestCount;
  }
  
  private stopLoading(requestCount: number = 1) {
    this.loadingCounter -= requestCount;
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
         if (email.folderName === 'sent') {
          this.snackBar.open("Email inviata con successo", 'Chiudi', {
            duration: 2000,
            panelClass: 'errore-snackbar',
          });
         }
        
        
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


  getCurrentDateWithDelay(): Observable<string> {
    const sentence = new Date().toString().toUpperCase();
    const words = sentence.split(' ');
    const delayMS = 1000;

    const wordDelay = (i: number) =>
      i === 0 ? delayMS : (words[i - 1].length + 1) * delayMS;

    const wordStart = (i: number) =>
      i < words.length
        ? of(i).pipe(delay(wordDelay(i)))
        : EMPTY.pipe(delay(wordDelay(i)));

    const wordObservable = (word: string) => {
      const letters = word.split('');

      return timer(0, delayMS).pipe(
        take(letters.length),
        map((i) => letters[i])
      );
    };

    return of(null).pipe(
      concatMap(() => wordStart(0)),
      concatMap((i) => wordObservable(words[i])),
      map((letter) => letter.trim())
    );
  }

}






