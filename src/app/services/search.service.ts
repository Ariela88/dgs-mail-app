import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { DataService } from './data.service';
import { FolderService } from './folder.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContactsService } from './contacts.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchResultsSubject = new BehaviorSubject<Mail[]>([]);
  public searchResults$: Observable<Mail[]> =
    this.searchResultsSubject.asObservable();
  private recentSearchTermsSubject = new BehaviorSubject<string[]>([]);
  public recentSearchTerms$: Observable<string[]> =
    this.recentSearchTermsSubject.asObservable();
  contacts: string[] = [];

  constructor(
    private dataService: DataService,
    public folderService: FolderService,
    private contactServ: ContactsService
  ) {
    this.dataService.getMailMessage().subscribe((emails: Mail[]) => {
      this.searchResultsSubject.next(emails);
    });
  
    this.searchResults$ = this.searchResultsSubject.asObservable(); 
  }
  
  

  searchMail(searchTerm: string): void {
    const searchResults: Mail[] = [];
    const addedEmails: Set<string> = new Set();
    
    for (const folderName in this.folderService.emails) {
      if (this.folderService.emails.hasOwnProperty(folderName)) {
        const folderMails = this.folderService.emails[folderName];
        folderMails.forEach((mail) => {
          if (
            this.contacts.includes(searchTerm.toLowerCase()) || 
            (mail.from && mail.from.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (mail.subject && mail.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (mail.body && mail.body.toLowerCase().includes(searchTerm.toLowerCase()))
          ) {
            if (!addedEmails.has(mail.id)) {
              searchResults.push(mail);  
              addedEmails.add(mail.id);
            }
          }
        });
      }
    }
  
    searchResults.forEach(mail => {
      this.folderService.copyEmailToFolder(mail, 'results');
    });
  
    this.searchResultsSubject.next(searchResults);
    const recentSearchTerms = this.recentSearchTermsSubject.value;
    recentSearchTerms.push(searchTerm);
    this.recentSearchTermsSubject.next(recentSearchTerms);
  }
  
  
  
  setDestinationFolder(mail: Mail, folderName: string): void {
    this.folderService.copyEmailToFolder(mail, folderName);
  }
}
