import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';
import { SearchService } from 'src/app/services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-folder-viewer',
  templateUrl: './folder-viewer.component.html',
  styleUrls: ['./folder-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderViewerComponent implements OnInit {
  originalEmails: Mail[] = [];
  searchResults: Mail[] = [];
  folderName?: string;
  searchTerm: string = '';
  emails?: Mail[] = [];
  isCheccked = false;
  searchResultsSubscription?: Subscription;
  selectedMails: Mail[] = [];

  constructor(
    public route: ActivatedRoute,
    private folderServ: FolderService,
    private router: Router,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.route.params?.subscribe(async (params) => {
      this.folderName = params['folderName'];
      if (this.folderName) {
        await this.getEmails();
        this.route.queryParams?.subscribe((params) => {
          if (params) {
            this.searchResultsSubscription = this.searchService.searchResults$?.subscribe(
              (searchResults) => {
                this.searchResults = searchResults;
                this.handleEmails();
                this.cdr.detectChanges(); 
              }
            );
          }
        });
      }
    });
  }
  
  private async getEmails() {
    try {
      const data = await this.folderServ.getEmails(this.folderName!).toPromise();
      this.emails = data;
      console.log('Emails ricevute:', this.emails);
      this.handleEmails();
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Errore nel recupero delle email:', error);
    }
  }
  
  

  handleEmails() {
    this.originalEmails = this.searchTerm ? this.searchResults : this.emails!;
    this.cdr.detectChanges();
  }

  selectedMail(id: string) {
    if (this.folderName && id) {
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

  handleCheckboxChange() {
    this.isCheccked = this.originalEmails.some((email) => email.selected);
    this.cdr.detectChanges();
  }

  deleteSelectedEmails() {
    const selectedEmails = this.originalEmails.filter(
      (email) => email.selected
    );
    if (selectedEmails.length > 0) {
      const selectedEmailIds = selectedEmails.map(
        (selectedEmail) => selectedEmail.id
      );
      this.folderServ.deleteEmails(selectedEmailIds, 'inbox');
      this.originalEmails = this.originalEmails.filter(
        (email) => !email.selected
      );
    } else {
      console.log("Nessuna email selezionata per l'eliminazione");
    }
  }

  anyCheckboxSelected(): boolean {
    return this.originalEmails.some((email) => email.selected);
  }

  toggleSelectAll(): void {
    const allSelected = this.allEmailsSelected();
    this.originalEmails.forEach((email) => (email.selected = !allSelected));
  }
  allEmailsSelected(): boolean {
    return this.originalEmails.every((email) => email.selected);
  }

  goToInbox(): void {
    this.router.navigate(['/folder', 'inbox']);
  }
}
