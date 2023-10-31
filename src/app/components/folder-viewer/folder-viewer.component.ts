import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';
import { FormsModule } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-folder-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './folder-viewer.component.html',
  styleUrls: ['./folder-viewer.component.scss'],
})
export class FolderViewerComponent implements OnInit {
  originalEmails: Mail[] = [];
  searchResults: Mail[] = [];
  folderName: string = 'inbox';
  searchTerm: string = '';
  emails: Mail[] = [];

  constructor(
    public route: ActivatedRoute,
    private folderServ: FolderService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const folderName = params['folderName'];
      this.originalEmails = this.folderServ.getEmails(folderName);
    });

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
  }

  selectedMail(mailId: string) {
    this.exitResultsView();
    this.router.navigate(['folder', this.folderName, 'mail', mailId]);
  }

  exitResultsView() {
    this.router.navigate(['/folder', this.folderName]);
  }
}
