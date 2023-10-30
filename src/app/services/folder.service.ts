import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class FolderService {

  allEmails:Mail[]=[]
   emails: { [key: string]: Mail[] } = {
    all: [],
    inbox: [],
    favorite: [],
    important: [],
    sent: [],
    trash:[]
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

  setEmails(emails: Mail[], folderName: string): void {
    this.emails[folderName] = emails;
    this.emailsSubject.next(emails);
  }

  getEmailsObservable(folderName: string): Observable<Mail[]> {
    this.selectFolder(folderName); // Aggiorna la cartella selezionata
    return this.emailsSubject.asObservable();
  }

  getEmails(folderName: string): Mail[] {
    if (folderName === 'inbox') {
      console.log('Getting emails for inbox...');
      return this.emails['inbox'];
    }
    console.log('Getting emails for folder:', folderName);
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
    email.folderName = 'trash'
  }
}


  copyEmailToFolder(email: Mail, targetFolder: string) {
    const mailToCopy = { ...email };
    if (!(targetFolder in this.emails)) {
        this.emails[targetFolder] = []; 
    }
    this.emails[targetFolder].push(mailToCopy);
    
}


  
}
