import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class FolderService {
  private emails: { [key: string]: Mail[] } = {
    'all':[],
    'inbox': [],
    'favorite': [],
    'important': [],
    'sent': [],
   
  };

  private selectedFolderSubject = new BehaviorSubject<string>('all');
  selectedFolder$ = this.selectedFolderSubject.asObservable();
  currentFolderName: string = 'all';
   
  getEmails(folderName: string): Mail[] {
    if (folderName === 'inbox') {
      return this.emails['inbox'] && this.emails['all'];
    }
    return this.emails[folderName] || [];
  }
  

  selectFolder(folderName: string) {
    this.selectedFolderSubject.next(folderName);
  }

  addEmailToFolder(email: Mail) {
  this.emails['all'].push(email);
  }

  addEmailToAllFolders(email: Mail) {
    for (const folderName in this.emails) {
      this.emails[folderName].push(email);
    }
  }

  removeEmailFromFolder(email: Mail, folderName: string): void {
    const index = this.emails[folderName].findIndex(existingEmail => existingEmail.id === email.id);
    if (index !== -1) {
      this.emails[folderName].splice(index, 1);
    }
  }
  
  
  moveEmailToFolder(email: Mail, targetFolder: string) {
    const sourceFolder = this.currentFolderName;
    const updatedEmails = this.emails[sourceFolder].filter(existingEmail => existingEmail !== email);
    this.emails[sourceFolder] = updatedEmails;
    this.emails[targetFolder] = [...(this.emails[targetFolder] || []), email];
  }
  

}
