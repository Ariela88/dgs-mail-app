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
    outgoing: [],
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
      this.sortEmailsIntoFolders(this.emailsSelected);
    });
  }

  private saveEmailToOutbox(email: Mail) {
    this.emails['outgoing'].push(email);
    this.emailsSubject.next(this.emails['outgoing']);
    email.folderName = 'outgoing';
  }

  setEmails(emails: Mail[], folderName: string): void {
    this.sortEmailsIntoFolders(emails);
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
    if (folderName === 'sent' || folderName === 'bozze') {
      this.dataServ.postMailMessage(email).subscribe(
        (response) => {
          console.log('Email sent and saved successfully:', response);
        },
        (error) => {
          console.log('Error sending email:', error);
          console.log('Saving email to outgoing folder...');
          this.saveEmailToOutbox(email);
          email.folderName = 'outgoing';
        }
      );
    } else {
      this.emails[folderName].push(email);
    }
  }

  private sortEmailsIntoFolders(emails: Mail[]): void {
    emails.forEach((email) => {
      const folderName = email.folderName || 'inbox';
      if (!(folderName in this.emails)) {
        this.emails[folderName] = [];
      }
      this.emails[folderName].push(email);
      if (folderName !== 'results') {
        this.emails['all'].push(email);
      }
    });
    this.emailsSubject.next(emails);
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
    if (email.folderName !== 'results') {
      this.emails['all'].push(mailToCopy);
      mailToCopy.folderName = targetFolder;
    }
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
