import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { FolderService } from './folder.service';
import { BehaviorSubject, Observable} from 'rxjs';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchResultsSubject = new BehaviorSubject<Mail[]>([]);
  searchResults$: Observable<Mail[]> = this.searchResultsSubject.asObservable();
  recentSearchTermsSubject = new BehaviorSubject<string[]>([]);
  recentSearchTerms$: Observable<string[]> = this.recentSearchTermsSubject.asObservable();
  contacts: string[] = [];


  constructor(public folderService: FolderService, private dataService:DataService) {
    this.dataService.getMailMessage().subscribe((emails: Mail[]) => {
      this.searchResultsSubject.next(emails);
       });  
        this.searchResults$ = this.searchResultsSubject.asObservable(); 
  }
  
  
  searchMail(searchTerm: string): void {
    let searchResults: Mail[] = [];
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
                   console.log(addedEmails,searchResults)
                    }
                     }
                      });
                        });
                       
                         searchResults.forEach((mail) => {
                          this.folderService.copyEmailToFolder(mail, 'results');
                          console.log(searchResults)
                           });
                           const recentSearchTerms = this.recentSearchTermsSubject.value;
                           console.log(recentSearchTerms)
                           
                            this.recentSearchTermsSubject.next(recentSearchTerms);
                              this.searchResultsSubject.next(searchResults);
                          console.log(searchResults)
                            
                              }
     
                              setDestinationFolder(mail: Mail, folderName: string): void {
                                this.folderService.copyEmailToFolder(mail, folderName);
                                  }

}
