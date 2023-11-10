import { EventEmitter, Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
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
    bozze:[]
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

  removeEmailFromFolder(emailId: string, folderName: string): void {

    //Da qui----->
    const index = this.emails[folderName].findIndex(
      (existingEmail) => existingEmail.id === emailId
    );
  
    if (index !== -1) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: {
          title: 'Conferma eliminazione',
          message: 'Sei sicuro di voler eliminare la mail?',
        },
        
      });
      console.log(ConfirmDialogComponent)
     dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const removedEmail = this.emails['inbox'][index];
          console.log(dialogRef)
  
         
          this.emails['inbox'].splice(index, 1);
  
//A qui--------->
          const allIndex = this.emails['inbox'].findIndex(
            (allEmail) => allEmail.id === emailId
          );
          if (allIndex !== -1) {
            this.emails['inbox'].splice(allIndex, 1);
          }

          // E dai qui----->
  
   
          removedEmail.folderName = 'trash';
          if (!this.emails['trash']) {
            this.emails['trash'] = [];
          }
          this.emails['trash'].push(removedEmail);
  
          this.emailRemovedSubject.next();
        }
      });
    }

    //a qui--------> i test danno probelmi se scommentati
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
   // console.log(`Aggiungendo email alla cartella ${targetFolder}:`, email);
  }

  getMailById(id: string): Observable<Mail | undefined> {
    //console.log('Chiamato getMailById con ID:', id);
    const mail = this.allEmails.find((email) => email.id === id);
    //console.log('Mail trovata:', mail);
    return of(mail);
  }
}
