import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject } from 'rxjs';

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
  };

  private selectedFolderSubject = new BehaviorSubject<string>('all');
  selectedFolder$ = this.selectedFolderSubject.asObservable();
  currentFolderName: string = 'all';

  getEmails(folderName: string): Mail[] {
    if (folderName === 'inbox') {
      return this.emails['inbox'] 
    }
    return this.emails[folderName] || [];
  }

  getAllEmails(){

    if ('all' in this.emails) {
      this.allEmails.push(...this.emails['all']);
    }
   
     return this.allEmails;
  }

  selectFolder(folderName: string) {
    this.selectedFolderSubject.next(folderName);
  }

  addEmailToFolder(email: Mail) {
    this.emails['inbox'].push(email);
  }

 
  removeEmailFromFolder(email: Mail, folderName: string): void {
    console.log('folder remove')
    const index = this.emails[folderName].findIndex(
        (existingEmail) => existingEmail.id === email.id
    );
    if (index !== -1) {
        this.emails[folderName].splice(index, 1);
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
