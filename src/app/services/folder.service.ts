import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private emails: { [key: string]: Mail[] } = {
    'inbox': [],
    'favorites': [],
    'important': [],
  };
  private selectedFolderSubject = new BehaviorSubject<string>('inbox');
selectedFolder$ = this.selectedFolderSubject.asObservable();

  currentFolderName: string = 'inbox';
  private selectedFolder: string = 'inbox';

  constructor() {
   
  }
  getEmails(folderName: string): Mail[] {
    return this.emails[folderName] || [];
  }

  selectFolder(folderName: string) {
    this.selectedFolder = folderName;
  }


  addEmailToFolder(email: Mail) {
    if (!this.emails[this.currentFolderName]) {
      this.emails[this.currentFolderName] = [];
    }
    const emailCopy: Mail = { ...email };
    
    this.emails[this.currentFolderName].push(emailCopy);
  }
  
  

  moveEmailToFolder(email: Mail, targetFolder: string) {
    const updatedEmails = this.emails[this.selectedFolder].filter(existingEmail => existingEmail !== email);
    this.emails[this.selectedFolder] = updatedEmails;
    const emailCopy: Mail = { ...email };
    this.emails[targetFolder] = [...(this.emails[targetFolder] || []), emailCopy];
    this.emails[this.currentFolderName] = [...(this.emails[this.currentFolderName] || []), emailCopy];
  }
  

 
 
  
  
}
