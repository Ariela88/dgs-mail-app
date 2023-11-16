import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject, Observable, of } from 'rxjs';
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

 

  emailRemovedSubject = new BehaviorSubject<void>(undefined);
  emailRemoved$ = this.emailRemovedSubject.asObservable();

  emailsSubject = new BehaviorSubject<Mail[]>([]);
  emails$ = this.emailsSubject.asObservable();

  folderNameSubject = new BehaviorSubject<string>('inbox');
  folderName$ = this.folderNameSubject.asObservable();

  emailsSelected: Mail[] = [];

  constructor(private dataServ: DataService) {
    this.dataServ.getMailMessage().subscribe((data) => {
      this.emailsSelected = data;
      this.setEmails(this.emailsSelected, 'inbox');
    });
  }

  setEmails(emails: Mail[], folderName: string): void {
    this.emails[folderName] = emails;
    this.emailsSubject.next(emails);
  }

  getEmailsObservable(folderName: string): Observable<Mail[]> {
    const emails = this.emails[folderName] || [];
    return of(emails);
  }

  getEmails(folderName: string): Observable<Mail[]> {
    const emails = this.emails[folderName] || [];
    this.updateEmailList(folderName);
    return of(emails);
  }

  addEmailToFolder(email: Mail, folderName: string) {
    console.log('add email to folder');
    if (folderName === 'sent') {
      this.dataServ.postMailMessage(email).subscribe((response) => {
        console.log('Email sent and saved successfully:', response);
      });
    } else if (folderName === 'bozze') {
      this.dataServ.postMailMessage(email).subscribe((response) => {
        console.log('Draft saved successfully:', response);
      });
    }

    this.emails[folderName].push(email);
  }

  deleteEmails(emailIds: string[], folderName: string): void {
    const indicesToRemove: number[] = [];
    emailIds.forEach((emailId) => {
      const index = this.emails[folderName].findIndex(
        (existingEmail) => existingEmail.id === emailId
      );
      if (index !== -1) {
        indicesToRemove.push(index);
        const deletedEmail = { ...this.emails[folderName][index] };
        this.emails['trash'].push(deletedEmail);
        deletedEmail.selected = false;
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
    this.emailsSubject.next(emails);
  }

  copyEmailToFolder(email: Mail, targetFolder: string) {
    const mailToCopy = { ...email };
    if (!(targetFolder in this.emails)) {
      this.emails[targetFolder] = [];
    }
    this.emails[targetFolder].push(mailToCopy);
    this.emails['all'].push(mailToCopy);
    mailToCopy.folderName = targetFolder;
  }

  getMailById(id: string): Observable<Mail | undefined> {
    const mail = this.allEmails.find((email) => email.id === id);
    return of(mail);
  }

  clearFolder(folderName: string): void {
    this.emails[folderName] = [];
    this.updateEmailList(folderName);
  }
}
