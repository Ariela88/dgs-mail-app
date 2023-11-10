import { Component, OnDestroy, OnInit } from '@angular/core';

import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';

import { SearchService } from 'src/app/services/search.service';
import { DataService } from 'src/app/services/data.service';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-folder-viewer',
  templateUrl: './folder-viewer.component.html',
  styleUrls: ['./folder-viewer.component.scss'],
 
})
export class FolderViewerComponent implements OnInit,OnDestroy {
  originalEmails: Mail[] = [];
  searchResults: Mail[] = [];
  folderName?: string;
  searchTerm: string = '';
  emails: Mail[] = [];
  messageSelected?: Mail;
  private searchResultsSubscription?: Subscription;
  private searchResults$?: Observable<Mail[]>
  constructor(
    public route: ActivatedRoute,
    private folderServ: FolderService,
    private router: Router,
    private searchService: SearchService,
    
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.folderName = params['folderName'];
      if (this.folderName) {
        this.originalEmails = this.folderServ.getEmails(this.folderName);
        this.route.queryParams.subscribe((params) => {
          const searchTerm = params['q'];
          if (searchTerm) {
            this.searchTerm = searchTerm;
            this.searchService.searchMail(searchTerm);
            if (this.searchService.searchResults$) { 
              this.searchResultsSubscription = this.searchService.searchResults$.subscribe((searchResults) => {
                this.searchResults = searchResults;
                this.handleEmails();
              });
            } else {
              console.error('searchResults$ non definito.');
            }
          } else {
            this.emails = this.originalEmails;
          }
        });
      } else {
        console.error('folderName non definito.');
      }
    });
  }
  

  ngOnDestroy() {
   
    if (this.searchResultsSubscription) {
      this.searchResultsSubscription.unsubscribe();
    }
  }

  handleEmails() {
    if (!this.searchTerm) {
      this.emails = this.originalEmails;
    } else {
      this.emails = this.searchResults;
    }
   // console.log('folder viewer', this.folderName, this.emails);
  }

  selectedMail(id: string) {
    if (this.folderName && id) {
     // console.log('Selected mail ID:', id);
      //console.log('Current folder:', this.folderName);
      const selectedEmail = this.originalEmails.find(
        (email) => email.id === id
      );
      if (selectedEmail) {
        selectedEmail.read = true;
        this.router.navigate(['/folder', this.folderName, 'mail', id]);
      } else {
        console.error('Mail non trovata.');
      }
    } else {
      console.error('folderName o id non definiti.');
    }
  }

  exitResultsView() {
    this.router.navigate(['/folder', this.folderName]);
  }

  deleteEmail(email: Mail) {
    //console.log('delete');
    this.folderServ.removeEmailFromFolder(email.id, 'inbox');
  }

  handleClick(folderName: string): void {
   // console.log('aggiorno lista', folderName);
    this.folderServ.updateEmailList(folderName);
  }
}
