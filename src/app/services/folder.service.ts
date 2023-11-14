import { EventEmitter, Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  allEmails: Mail[] = [];
  emails: { [key: string]: Mail[] } = {
    all: [],
    inbox: [],
    favorite: [],
    important: [],
    sent: [],
    trash: [],
    results: [],
    bozze: [],
  };

  selectedFolderSubject = new BehaviorSubject<string>('all');
  selectedFolder$ = this.selectedFolderSubject.asObservable();
  currentFolderName: string = 'inbox';
  emailRemovedSubject = new BehaviorSubject<void>(undefined);
  emailRemoved$ = this.emailRemovedSubject.asObservable();
  emailsSubject = new BehaviorSubject<Mail[]>([]);
  emails$ = this.emailsSubject.asObservable();
  folderNameSubject = new BehaviorSubject<string>('inbox');
  folderName$ = this.folderNameSubject.asObservable();

  constructor(private dataServ: DataService) {
    
  }

  setEmails(emails: Mail[], folderName: string): void {
    this.emails[folderName] = emails;

    this.emailsSubject.next(emails);
    console.log(this.emails, 'setEmails');
  }

  getEmailsObservable(folderName: string): Observable<Mail[]> {
    const emails = this.emails[folderName] || [];
    // console.log('Messaggi nella cartella', folderName, ':', emails);
    return of(emails);
  }

  getEmails(folderName: string): Observable<Mail[]> {
    return this.dataServ.getMailMessage().pipe(
      map((emails) => {
        this.emails[folderName] = emails;
        this.updateEmailList(folderName);
        return this.emails[folderName] || [];
      })
    );
  }
  

  
  addEmailToFolder(email: Mail, folderName: string) {
    console.log('add email to folder')
    this.emails[folderName].push(email);

    //console.log(this.emails,'addEmail')
  }

  deleteEmails(emailIds: string[], folderName: string): void {
    const indicesToRemove: number[] = [];
    emailIds.forEach((emailId) => {
      const index = this.emails[folderName].findIndex(
        (existingEmail) => existingEmail.id === emailId
      );

      if (index !== -1) {
        indicesToRemove.push(index);
      }
    });

    indicesToRemove.reverse().forEach((index) => {
      this.emails[folderName].splice(index, 1);
    });

    this.dataServ.deleteMail(emailIds).subscribe(
      () => {
        console.log('Mail cancellata con successo');
        this.emailRemovedSubject.next();
      },
      (error) => {
        console.error('Errore nella cancellazione della mail:', error);
      }
    );
  }

  updateEmailList(folderName: string): void {
    const emails = this.emails[folderName] || [];
    this.emails['all'] = [...emails]; 
    this.emailsSubject.next(emails);
  }
  
  copyEmailToFolder(email: Mail, targetFolder: string) {
    const mailToCopy = { ...email };
    if (!(targetFolder in this.emails)) {
      this.emails[targetFolder] = [];
    }
    this.emails[targetFolder].push(mailToCopy);
    //this.emails['all'].push(mailToCopy);
    mailToCopy.folderName = targetFolder;
    console.log(`Aggiungendo email alla cartella ${targetFolder}:`, email);
    console.log('Emails in ' + targetFolder + ':', this.emails[targetFolder]);
    console.log('All emails:', this.emails['all']);
    this.dataServ.postMailMessage(email).subscribe(
      (response) => {
        console.log('Email copiata con successo:', response);
      },
      (error) => {
        console.error("Errore durante la copia dell'email:", error);
      }
    );
  }

  getMailById(id: string): Observable<Mail | undefined> {
    //console.log('Chiamato getMailById con ID:', id);
    const mail = this.allEmails.find((email) => email.id === id);
    //console.log('Mail trovata:', mail);
    return of(mail);
  }
}
