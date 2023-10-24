import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private folders: { [key: string]: Mail[] } = {};
  private selectedFolderSubject = new BehaviorSubject<string>('inbox');
  selectedFolder$ = this.selectedFolderSubject.asObservable();
  currentFolderName: string = 'inbox';

  constructor() {
    this.folders['inbox'] = [];
    this.folders['sent'] = [];
    this.folders['favorites'] = [];
    this.folders['important'] = [];
  }

  getFolder(): Mail[] {
    return this.folders[this.currentFolderName] || [];
  }

  selectFolder(folderName: string) {
    this.currentFolderName = folderName;
    this.selectedFolderSubject.next(folderName);
  }

  addEmailToFolder(email: Mail) {
    if (!this.folders[this.currentFolderName]) {
      this.folders[this.currentFolderName] = [];
    }
    this.folders[this.currentFolderName].push(email);
  }

  moveEmailToFolder(email: Mail, targetFolder: string) {
   
    const index = this.folders[this.currentFolderName].indexOf(email);
    if (index !== -1) {
      this.folders[this.currentFolderName].splice(index, 1);
    }

    if (!this.folders[targetFolder]) {
      this.folders[targetFolder] = [];
    }
    this.folders[targetFolder].push(email);
  }
}
