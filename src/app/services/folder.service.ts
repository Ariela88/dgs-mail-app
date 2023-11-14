import { EventEmitter, Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

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
  currentFolderName: string = 'all';
  emailRemovedSubject = new BehaviorSubject<void>(undefined);
  emailRemoved$ = this.emailRemovedSubject.asObservable();
  emailsSubject = new BehaviorSubject<Mail[]>([]);
  emails$ = this.emailsSubject.asObservable();
  folderNameSubject = new BehaviorSubject<string>('inbox');
  folderName$ = this.folderNameSubject.asObservable();
  folderChanged = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {
    for (const folderName in this.emails) {
      if (folderName !== 'all') {
        this.emails['all'] = this.emails['all'].concat(this.emails[folderName]);
      }
    }
  }
  changeFolder(folderName: string) {
    this.folderChanged.emit(folderName);
  }

  setEmails(emails: Mail[], folderName: string): void {
    this.emails[folderName] = emails;

    this.emailsSubject.next(emails);
  }

  getEmailsObservable(folderName: string): Observable<Mail[]> {
    const emails = this.emails[folderName] || [];
    // console.log('Messaggi nella cartella', folderName, ':', emails);
    return of(emails);
  }

  getEmails(folderName: string): Mail[] {
    return this.emails[folderName] || [];
  }

  selectFolder(folderName: string) {
    this.currentFolderName = folderName;
    this.folderNameSubject.next(folderName);

    const emails = this.emails[folderName] || [];
    this.emailsSubject.next(emails);
  }

  addEmailToFolder(email: Mail, folderName: string) {
    if (!(folderName in this.emails)) {
      this.emails[folderName] = [];
    }
    this.emails[folderName].push(email);
    this.emails['all'].push(email);
  }

  removeEmailFromFolder(emailIds: string[], folderName: string): void {
    const emailsToRemove = emailIds.map((emailId) =>
      this.emails[folderName].find(
        (existingEmail) => existingEmail.id === emailId
      )
    );

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
      const removedEmail = { ...this.emails[folderName][index] };
      this.emails[folderName].splice(index, 1);

      if (folderName === 'inbox') {
        const allIndex = this.emails['inbox'].findIndex(
          (allEmail) => allEmail.id === removedEmail.id
        );
        if (allIndex !== -1) {
          this.emails['inbox'].splice(allIndex, 1);
        }
      }

      removedEmail.folderName = 'trash';
      if (!this.emails['trash']) {
        this.emails['trash'] = [];
      }
      this.emails['trash'].push(removedEmail);
      removedEmail.selected = false;
    });

    this.emailRemovedSubject.next();
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
    console.log(`Aggiungendo email alla cartella ${targetFolder}:`, email);
    console.log('Emails in ' + targetFolder + ':', this.emails[targetFolder]);
    console.log('All emails:', this.emails['all']);
  }

  getMailById(id: string): Observable<Mail | undefined> {
    //console.log('Chiamato getMailById con ID:', id);
    const mail = this.allEmails.find((email) => email.id === id);
    //console.log('Mail trovata:', mail);
    return of(mail);
  }
}
