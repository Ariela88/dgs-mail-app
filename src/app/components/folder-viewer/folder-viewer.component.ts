import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';
import { SearchService } from 'src/app/services/search.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-folder-viewer',
  templateUrl: './folder-viewer.component.html',
  styleUrls: ['./folder-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderViewerComponent implements OnInit, OnDestroy {
  originalEmails: Mail[] = [];
  searchResults: Mail[] = [];
  folderName?: string;
  searchTerm: string = '';
  emails?: Mail[] = [];
  isChecked = false;
  searchResultsSubscription?: Subscription;
  selectedMails: Mail[] = [];
  sortingType: 'date' | 'sender' = 'date';
  order: string = 'desc';
  private unsubscribe$ = new Subject<void>();

  constructor(
    public route: ActivatedRoute,
    private folderServ: FolderService,
    private router: Router,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public dataServ: DataService
  ) {}

  async ngOnInit() {
    this.route.params?.subscribe(async (params) => {
      this.folderName = params['folderName'];
      if (this.folderName) {
        await this.getEmails();
        this.route.queryParams?.subscribe((params) => {
          if (params) {
            this.searchResultsSubscription =
              this.searchService.searchResults$?.subscribe((searchResults) => {
                this.searchResults = searchResults;
                this.handleEmails();
                this.cdr.detectChanges();
              });
            this.folderServ.emails$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((emails) => {
                this.emails = emails;
                this.handleEmails();
                this.cdr.detectChanges();
              });
          }
        });
      }
    });

    console.log(this.folderName,this.searchResults,'oninit folderviewer')
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.searchResultsSubscription) {
      this.searchResultsSubscription.unsubscribe();
    }
  }

  private async getEmails() {
    try {
      if (this.folderName) {
        const data = await this.folderServ
          .getEmails(this.folderName)
          .toPromise();
        this.emails = data;
        console.log('Emails ricevute:', this.folderName, this.emails);
        this.handleEmails();
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Errore nel recupero delle email:', error);
    }
  }

  changeSortOrder() {
    this.handleEmails();
  }

  getSortedEmails(): Mail[] {
    return this.originalEmails.slice().sort((a, b) => {
      if (this.sortingType === 'date') {
        return a.created > b.created ? -1 : 1;
      } else {
        return a.from.localeCompare(b.from);
      }
    });
  }

  handleEmails() {
    this.originalEmails = this.searchTerm ? this.searchResults : this.emails!;
    this.isChecked = this.originalEmails.some((email) => email.selected);
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
    this.isChecked = this.originalEmails.some((email) => email.selected);
    this.cdr.detectChanges();
  }

  deleteSelectedEmails() {
    const selectedEmails = this.originalEmails.filter(
      (email) => email.selected
    );

    if (selectedEmails.length > 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Sei sicuro di voler eliminare le email selezionate?',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const selectedEmailIds = selectedEmails.map(
            (selectedEmail) => selectedEmail.id
          );
          this.folderServ.deleteEmails(selectedEmailIds, this.folderName!);
          this.originalEmails = this.originalEmails.filter(
            (email) => !email.selected
          );
          this.handleCheckboxChange();
          this.cdr.detectChanges();
        }
      });
    } else {
      console.log("Nessuna email selezionata per l'eliminazione");
    }
  }

  deleteDefinitivlyEmail() {
    const selectedEmails = this.originalEmails.filter(
      (email) => email.selected
    );

    if (selectedEmails.length > 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Sei sicuro di voler eliminare le email selezionate?',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const selectedEmailIds = selectedEmails.map(
            (selectedEmail) => selectedEmail.id
          );
          this.folderServ.deleteEmailDefinitely(selectedEmailIds, 'trash');
        }
      });
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
    this.router.navigate(['/folder', 'all']);
  }

  counter(emails: Mail[]): number {
    let counter = 0;
    emails.forEach((email) => {
      if (!email.read) {
        counter++;
      }
    });

    return counter;
  }

  checkedCounter(emails: Mail[]): number {
    let counter = 0;
    emails.forEach((email) => {
      if (email.selected) {
        counter++;
      }
    });

    return counter;
  }
}
