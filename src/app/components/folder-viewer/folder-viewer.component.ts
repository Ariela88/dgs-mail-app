import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';
import { FormsModule } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { DataService } from 'src/app/services/data.service';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { NavActionsComponent } from '../nav-actions/nav-actions.component';
import { ContactsComponent } from '../contacts/contacts.component';

@Component({
  selector: 'app-folder-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule,NavActionsComponent,ContactsComponent],
  templateUrl: './folder-viewer.component.html',
  styleUrls: ['./folder-viewer.component.scss'],
})
export class FolderViewerComponent implements OnInit {
  originalEmails: Mail[] = [];
  searchResults: Mail[] = []
  folderName?: string;
  searchTerm: string = '';
  emails: Mail[] = [];
  messageSelected?:Mail;
 

  constructor(
    public route: ActivatedRoute,
    private folderServ: FolderService,
    private router: Router,
    private searchService: SearchService,
    private dataServ: DataService
  ) {}

  ngOnInit() {
    this.dataServ.getMailMessage().subscribe((emails) => {
      this.folderServ.setEmails(emails, 'inbox');
      this.originalEmails = this.folderServ.getEmails(
        this.folderName || 'inbox'
      );
      this.emails = this.originalEmails;
    });
    // this.route.params.subscribe((params) => {
    //   this.folderName = params['folderName'];
    //   if (this.folderName) {
    //     this.originalEmails = this.folderServ.getEmails(this.folderName);
    //   } else {
    //     console.error('folderName non definito.');
    //   }
    // });
    
    this.route.queryParams.subscribe((params) => {
      const searchTerm = params['q'];
      if (searchTerm) {
        this.searchTerm = searchTerm;
        this.searchService.searchMail(searchTerm);
      }
    });

    this.searchService.searchResults$.subscribe((searchResults) => {
      this.searchResults = searchResults;
    });

    if (!this.searchTerm) {
      this.emails = this.originalEmails;
    } else {
      this.emails = this.searchResults;
    }
    console.log('folder viewer',this.folderName,this.emails)
  }

  selectedMail(id: string) {
    console.log('Selected mail ID:', id);
    console.log('Current folder:', this.folderName);

    if (this.folderName && id) {
      this.router.navigate(['/folder', this.folderName, 'mail', id]);
    } else {
      console.error('folderName o id non definiti.');
    }
  }

  exitResultsView() {
    this.router.navigate(['/folder', this.folderName]);
  }

  deleteEmail(email: Mail) {
    console.log('delete');
    this.folderServ.removeEmailFromFolder(email.id, 'inbox');
   
  }
}