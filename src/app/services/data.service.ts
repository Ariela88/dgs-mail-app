import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import { Mail } from '../model/mail';
import { FolderService } from './folder.service';


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

  constructor(private http: HttpClient, private folderServ:FolderService) {}



  getMailMessage(): Observable<Mail[]> {
    return this.http.get<Mail[]>('/assets/mail.json').pipe(
      tap((emails: Mail[]) => {
        this.folderServ.setEmails(emails, 'inbox');
        this.allMailSubject.next(emails); 
      })
    );
  }
  
  

  sendMail(mail: Mail) {
    console.log(mail,'dataServ send')
    
    
  }

  

  
  
}
