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
    const emails = this.emails[folderName] || [];
    console.log('Messaggi nella cartella', folderName, ':', emails);
    return of(emails);
  }
  

  getEmails(folderName: string): Mail[] {
    return this.emails[folderName] || [];
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
  removeEmailFromFolder(emailId: string, folderName: string): void {
    const index = this.emails[folderName].findIndex(existingEmail => existingEmail.id === emailId);
    const isConfirmed = window.confirm('Sei sicuro di voler eliminare la mail?');  
    if (isConfirmed) {
      if (index !== -1) {
        const removedEmail = this.emails[folderName][index];
        this.emails[folderName].splice(index, 1);
  
        removedEmail.folderName = 'trash';
        if (!this.emails['trash']) {
          this.emails['trash'] = [];
        }
        this.emails['trash'].push(removedEmail);
        this.emails['all'].push(removedEmail);
        
        this.emailRemovedSubject.next();
      }
    }
  }
  
copyEmailToFolder(email: Mail, targetFolder: string) {
    const mailToCopy = { ...email };
    if (!(targetFolder in this.emails)) {
      this.emails[targetFolder] = [];
    }
    this.emails[targetFolder].push(mailToCopy);
    this.emails['all'].push(mailToCopy);
  }

  getMailById(id: string): Observable<Mail | undefined> {
    console.log('Chiamato getMailById con ID:', id);
    const mail = this.allEmails.find((email) => email.id === id);
    console.log('Mail trovata:', mail);
    return of(mail);
  }
  
  
}
