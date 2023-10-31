import { EventEmitter, Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject, Observable, of } from 'rxjs';

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
  };

  private selectedFolderSubject = new BehaviorSubject<string>('all');
  selectedFolder$ = this.selectedFolderSubject.asObservable();
  currentFolderName: string = 'all';
  private emailRemovedSubject = new BehaviorSubject<void>(undefined);
  emailRemoved$ = this.emailRemovedSubject.asObservable();
  private emailsSubject = new BehaviorSubject<Mail[]>([]);
  emails$ = this.emailsSubject.asObservable();
  private folderNameSubject = new BehaviorSubject<string>('inbox');
  folderName$ = this.folderNameSubject.asObservable();
  folderChanged = new EventEmitter<string>();

  changeFolder(folderName: string) {
    this.folderChanged.emit(folderName);
  }

  setEmails(emails: Mail[], folderName: string): void {
    this.emails[folderName] = emails;
    this.emailsSubject.next(emails);
  }

  getEmailsObservable(folderName: string): Observable<Mail[]> {
    this.selectFolder(folderName);
    return of(this.emails[folderName] || []);
  }
  

  getEmails(folderName: string): Mail[] {
    return this.emails[folderName] || [];
  }

  getAllEmails(): Mail[] {
    if ('all' in this.emails) {
      return this.emails['all'];
    }
    return [];
  }

  selectFolder(folderName: string) {
    this.selectedFolderSubject.next(folderName);
  }

  addEmailToFolder(email: Mail, folderName: string) {
    if (!(folderName in this.emails)) {
      this.emails[folderName] = [];
    }
    this.emails[folderName].push(email);
    this.emails['all'].push(email);
  }

  removeEmailFromFolder(email: Mail, folderName: string): void {
    const index = this.emails[folderName].findIndex(
      (existingEmail) => existingEmail.id === email.id
    );
    if (index !== -1) {
      this.emails[folderName].splice(index, 1);
      this.emails['trash'].push(email);

      if (folderName === 'inbox') {
        const inboxIndex = this.emails['inbox'].findIndex(
          (existingEmail) => existingEmail.id === email.id
        );
        if (inboxIndex !== -1) {
          this.emails['inbox'].splice(inboxIndex, 1);
        }
      }
      this.emailRemovedSubject.next();
      email.folderName = 'trash';
    }
  }

  copyEmailToFolder(email: Mail, targetFolder: string) {
    const mailToCopy = { ...email };
    if (!(targetFolder in this.emails)) {
      this.emails[targetFolder] = [];
    }
    this.emails[targetFolder].push(mailToCopy);
  }

  getMailById(mailId: string): Observable<Mail | undefined> {
    console.log('Chiamato getMailById con ID:', mailId);
    const mail = this.allEmails.find((email) => email.id === mailId);
    console.log('Mail trovata:', mail);
    return of(mail);
  }
  
  
}
