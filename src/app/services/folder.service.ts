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

  removeEmailFromFolder(email:Mail,folderName:string){
    const folderIndex = this.emails[folderName].findIndex(
      (existingEmail) => existingEmail = email
    );

    if (folderIndex !== -1) {
      
      this.emails[folderName].splice(folderIndex, 1);
      
    }
    console.log(folderIndex,email,'remove from folder')
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
    emailIds.forEach((emailId) => {
      const folderIndex = this.emails[folderName].findIndex(
        (existingEmail) => existingEmail.id === emailId
      );

      if (folderIndex !== -1) {
        const deletedEmail = this.emails[folderName][folderIndex];
        this.emails[folderName].splice(folderIndex, 1);

        this.copyEmailToFolder(deletedEmail, 'trash');
      }

      const allIndex = this.emails['all'].findIndex(
        (allEmail) => allEmail.id === emailId
      );
      if (allIndex !== -1) {
        this.emails['all'].splice(allIndex, 1);
      }
    });

    this.updateEmailList(folderName);
  }

  async deleteEmailDefinitely(
    emailIds: string[],
    folderName: string
  ): Promise<void> {
    console.log('Emails da eliminare definitivamente:', emailIds);
    const indicesToRemove: number[] = [];

    emailIds.forEach((emailId) => {
      const index = this.emails['trash'].findIndex(
        (deletedEmail) => deletedEmail.id === emailId
      );
      if (index !== -1) {
        indicesToRemove.push(index);
      }
    });

    indicesToRemove.reverse().forEach((index) => {
      this.emails['trash'].splice(index, 1);
    });

    this.updateEmailList('trash');
    await this.dataServ.deleteMail(emailIds).toPromise();

    
    emailIds.forEach((emailId) => {
      const index = this.emails['all'].findIndex(
        (allEmail) => allEmail.id === emailId
      );
      if (index !== -1) {
        this.emails['all'].splice(index, 1);
      }
    });

    Object.keys(this.emails).forEach((folder) => {
      this.updateEmailList(folder);
    });

    console.log('Mail eliminata definitivamente con successo', this.emails);
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
      console.log(email.folderName, 'target folder', targetFolder);
      //this.dataServ.putMailMessage(mailToCopy);
    }
    this.emails[targetFolder].push(mailToCopy);
    if (email.folderName !== 'results') {
      this.emails['all'].push(mailToCopy);
      mailToCopy.folderName = targetFolder;
      console.log(email.folderName, 'target folder', targetFolder);
      //this.dataServ.putMailMessage(mailToCopy);
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
