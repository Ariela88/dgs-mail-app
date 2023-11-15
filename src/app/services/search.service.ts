import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { FolderService } from './folder.service';
import { BehaviorSubject, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchResultsSubject = new BehaviorSubject<Mail[]>([]);
  searchResults$: Observable<Mail[]> = this.searchResultsSubject.asObservable();
  recentSearchTermsSubject = new BehaviorSubject<string[]>([]);
  recentSearchTerms$: Observable<string[]> = this.recentSearchTermsSubject.asObservable();
  contacts: string[] = [];


  constructor(public folderService: FolderService) {}
  
  
  searchMail(searchTerm: string): void {
    const searchResults: Mail[] = [];
      const addedEmails: Set<string> = new Set();  
        Object.values(this.folderService.emails).forEach((folderMails) => {
          folderMails.forEach((mail) => {
            if ( this.contacts.includes(searchTerm.toLowerCase()) ||
             (mail.body && mail.body.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (mail.from && mail.from.toLowerCase().includes(searchTerm.toLowerCase()))
               ) {
                if (!addedEmails.has(mail.id)) {
                 searchResults.push(mail);
                   addedEmails.add(mail.id);
                    }
                     }
                      });
                        });
                         searchResults.forEach((mail) => {
                          this.folderService.copyEmailToFolder(mail, 'results');
                           });
                            this.searchResultsSubject.next(searchResults);
                                 }

     
}
