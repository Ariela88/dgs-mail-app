import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { FolderService } from './folder.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../components/loading/loading.component';


@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchResultsSubject = new BehaviorSubject<Mail[]>([]);
  searchResults$: Observable<Mail[]> = this.searchResultsSubject.asObservable();
  recentSearchTermsSubject = new BehaviorSubject<string[]>([]);
  recentSearchTerms$: Observable<string[]> =
    this.recentSearchTermsSubject.asObservable();
  contacts: string[] = [];
  searchResults: Mail[] = [];
  loading: boolean = false;

  constructor(
    private matDialog: MatDialog,
    public folderService: FolderService,
    private dataService: DataService,
  ) {
    this.dataService.getMailMessage().subscribe((emails: Mail[]) => {
      this.searchResultsSubject.next(emails);
    });
    this.searchResults$ = this.searchResultsSubject.asObservable();

  

    console.log('ricerca');
  }

  async searchMail(searchTerm: string): Promise<void> {
    console.log('ricerca in corso per data');
    this.searchResults = []
    await this.clearResults();
    const addedEmails: Set<string> = new Set();
    Object.values(this.folderService.emails).forEach((folderMails) => {
      folderMails.forEach((mail) => {
        if (
          this.contacts.includes(searchTerm.toLowerCase()) ||
          (mail.body &&
            mail.body.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (mail.to &&
            mail.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (mail.from &&
              mail.from.toLowerCase().includes(searchTerm.toLowerCase()))
        ) {
          if (!addedEmails.has(mail.id)) {
            this.searchResults.push(mail);
            addedEmails.add(mail.id);
            console.log(addedEmails, this.searchResults);
          }
          
        }
      });
    });

    this.searchResults.forEach((mail) => {
      this.folderService.copyEmailToFolder(mail, 'results');
      console.log(this.searchResults);
    });

    console.log(this.searchResults);
  }

  searchMailInMockapi(searchTerm: string): void {
    this.clearResults();
    this.showLoading();
    const url = new URL('https://651a7a94340309952f0d59cb.mockapi.io/emails');
    url.searchParams.append('title', searchTerm);
    fetch(url, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((emails) => {
        console.log(emails);
        emails.forEach((email: Mail) => {
          const searchTermLower = searchTerm.toLowerCase();
          const isInBody =
            email.body && email.body.toLowerCase().includes(searchTermLower);
          const isInFrom =
            email.from && email.from.toLowerCase().includes(searchTermLower);
          const isInTo =
            email.to && email.to.toLowerCase().includes(searchTermLower);

          if (isInBody || isInFrom || isInTo) {
            this.folderService.copyEmailToFolder(email, 'results');
            if (!this.searchResults.includes(email)) {
              this.searchResults.push(email);
            }
          }
        });

        this.searchResultsSubject.next(this.searchResults);
      })
      .catch((error) => {
        console.error('Error fetching emails:', error);
      })
      .finally(() => {
        this.hideLoading();
      });
  }

  showLoading(): void {
    const dialogRef = this.matDialog.open(LoadingComponent, {
      data: { message: 'Loading...' },
      disableClose: true,
    });
  }

  hideLoading(): void {
    this.matDialog.closeAll();
  }

  setDestinationFolder(mail: Mail, folderName: string): void {
    this.folderService.copyEmailToFolder(mail, folderName);
  }

  async clearResults(): Promise<void> {
    console.log('Clearing results...');
    
    try {
      await this.folderService.clearFolder('results');
      this.searchResults = [];
      this.searchResultsSubject.next([]);
      console.log('Results cleared.');
    } catch (error) {
      console.error('Error clearing results:', error);
    }
  }
  
  getAllEmails(): Mail[] {
    this.dataService.getMailMessage()
    return Object.values(this.folderService.emails).reduce((allEmails, folderMails) => allEmails.concat(folderMails), []);
  }


  searchMailByDate(selectedDate: Date): void {
    this.clearResults();
    
    let filteredEmails: Mail[] = [];
    const allEmails = this.getAllEmails();
  
    allEmails.forEach((mail) => {
      console.log('Processing email:', mail);
      if (mail.created) {
        const emailDate = new Date(mail.created);
        mail.selectable = this.isSameDay(emailDate, selectedDate);
        if (mail.selectable) {
          filteredEmails.push(mail);
        }
      }
    });
  
    console.log('filteredEmails:', filteredEmails);
    let filteredEmailsSet = new Set(filteredEmails);
    this.searchResults = Array.from(filteredEmailsSet);
    console.log('Final searchResults:', this.searchResults);
  
    this.searchResults.forEach((mail) => {
      this.folderService.copyEmailToFolder(mail, 'results');
      console.log(this.searchResults);
    });
  }

initialize(initialDate: Date): void {
  if (initialDate) {
    this.searchMailByDate(initialDate);
  }

  console.log('Ricerca inizializzata');
}

  

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

}
