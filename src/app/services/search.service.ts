import { Injectable } from '@angular/core';
import { Mail } from '../model/mail';
import { DataService } from './data.service';
import { FolderService } from './folder.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  emails: Mail[] = [];
  private searchResultsSubject = new BehaviorSubject<Mail[]>([]);
  public searchResults$: Observable<Mail[]> = this.searchResultsSubject.asObservable();

  constructor(private dataService: DataService, public folderService:FolderService,private router:Router) {
    this.dataService.getMailMessage().subscribe((emails: Mail[]) => {
      this.emails = emails;
    });
  }

  searchMail(searchTerm: string): Mail[] {
    const searchResults: Mail[] = [];
    this.searchResultsSubject.next(searchResults);
    for (const folderName in this.folderService.emails) {
      if (this.folderService.emails.hasOwnProperty(folderName)) {
        const folderMails = this.folderService.emails[folderName];
        folderMails.forEach((mail) => {
          if (
            mail.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mail.body.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            searchResults.push(mail);
            this.router.navigateByUrl('search')
          }
        });
      } 
    }

    return searchResults ;
  }
}
