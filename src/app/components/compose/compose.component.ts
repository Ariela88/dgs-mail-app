import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';
import { FolderService } from 'src/app/services/folder.service';
import { ContactsService } from 'src/app/services/contacts.service';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, FormsModule],
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
})
export class ComposeComponent implements OnInit {
  newMailForm: FormGroup;
  data: any;
  isContact: boolean = false;
  toValue: string = '';

  @Input() isComposeMode: boolean = true;
  @Input() selectedMail?: Mail | null = null;

  contacts: string[] = [];
  selectedRecipients: string[] = [];
  selectedContact: any;
  contactCtrl = new FormControl('');
  filteredOptions: Observable<any[]>;
  @ViewChild('contactsInput') contactsInput?: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  announcer = inject(LiveAnnouncer);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private folderService: FolderService,
    private router: Router,
    private contactsService: ContactsService,
    private dialog:MatDialog,
    private snackBar:MatSnackBar
  ) {
    this.newMailForm = this.fb.group({
      to: new FormControl('', [Validators.required]),
      from: ['manuela@gmail.com'],
      subject: [''],
      body: [''],
    });
    console.log(this.newMailForm);

    this.filteredOptions = this.contactCtrl.valueChanges.pipe(
      startWith(null),
      map((contact: string | null) =>
        contact ? this._filter(contact) : this.contacts.slice()
      )
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.contacts = this.contactsService.getContact();
      const emailDataString = this.route.snapshot.queryParams['emailData'];
      const isForwarding = this.route.snapshot.queryParams['isForwarding'];
      const isReply = this.route.snapshot.queryParams['isReply'];
      const isContact = this.route.snapshot.queryParams['isContact'];
      const recipient = params['to'];

      if (isReply && emailDataString) {
        const emailData = JSON.parse(emailDataString);
        this.newMailForm.patchValue({
          to: emailData.from,
          subject: 'Re: ' + emailData.subject,
        });
        this.selectedRecipients.push(emailData.from)
        console.log(emailDataString);
        console.log(emailData.from, isReply);
      } else if (isForwarding && emailDataString) {
        const emailData = JSON.parse(emailDataString);
        this.newMailForm.patchValue({
          subject: 'Inolter: ' + emailData.subject,
          body: 'Inoltrato:' + '(' + emailData.body + ')',
        });
      } else if (isContact && recipient) {
        this.newMailForm.patchValue({
          to: recipient,
        });
        console.log('Contact to:');
        console.log('Recipient:', recipient);
      }
    });
  }

  generateRandomId(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
    return randomId;
  }

  onSubmit() {
    if (this.newMailForm.valid) {
      const selectedEmail = this.newMailForm.get('to')?.value;
      this.selectedContact = this.contacts.find(
        (contact) => contact === selectedEmail
      );
      const sentMail: Mail = {
        id: this.generateRandomId(),
        from: 'manuela@gmail.com',
        to: selectedEmail,
        recipientName: this.selectedContact ? this.selectedContact : '',
        subject: this.newMailForm.get('subject')?.value,
        body: this.newMailForm.get('body')?.value,
        sent: true,
        important: false,
        isFavourite: false,
        completed: false,
        selected: false,
        folderName: 'sent',
        attachment: this.selectedMail?.attachment,
        read:false
      };

      this.folderService.copyEmailToFolder(sentMail, 'sent');
      sentMail.folderName = 'sent';
      this.snackBar.open('Email inviata con successo', 'Chiudi', {
        duration: 2000,
      });
      console.log(sentMail);
      this.router.navigateByUrl('home');
    }
  }

  closeModal() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Conferma uscita',
        message: 'Sei sicuro di voler uscire dall editor?',
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.modalService.closeModal();
      }
    });
  }
  

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.contacts.filter((contact) =>
      contact.toLowerCase().includes(filterValue)
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.contacts.push(value);
    }
    event.chipInput!.clear();
    this.contactCtrl.setValue(null);
  }

  remove(contact: string): void {
    const index = this.selectedRecipients.indexOf(contact);
    if (index >= 0) {
      this.selectedRecipients.splice(index, 1);
      this.announcer.announce(`Removed ${contact}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedEmail = event.option.viewValue.trim();
    const isDuplicate = this.selectedRecipients.some(
      (recipient) => recipient.trim() === selectedEmail
    );

    if (!isDuplicate) {
      this.selectedRecipients.push(selectedEmail);
      this.newMailForm.get('to')?.setValue(selectedEmail);

      if (!this.contacts.includes(selectedEmail)) {
        this.contacts.push(selectedEmail);
        this.contactsService.setContacts(this.contacts);
      }
    }

    this.contactsInput!.nativeElement.value = '';
    this.contactCtrl.setValue(null);
  }
}
