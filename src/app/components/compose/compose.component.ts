import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';
import { ContactsService } from 'src/app/services/contacts.service';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contact } from 'src/app/model/contact';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
})
export class ComposeComponent implements OnInit {
  newMailForm: FormGroup;
  data: any;
  isContact: boolean = false;
  @Input() isComposeMode: boolean = true;
  @Input() selectedMail?: Mail | null = null;
  sortedOptions$: Observable<Contact[]>;
  contacts: Contact[] = [];
  selectedRecipients: Contact[] = [];
  isSent: boolean = false;
  isDraft: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  announcer = inject(LiveAnnouncer);
  selectedContact: any;
  contactCtrl = new FormControl('');
  filteredOptions: Observable<any[]>;
  @ViewChild('contactsInput') contactsInput?: ElementRef<HTMLInputElement>;
  isLoading: boolean = false;
  @Input() dateSelected = new Date();
 
disableDatesBeforeToday = true; 


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private folderService: FolderService,
    private router: Router,
    private contactsService: ContactsService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.newMailForm = this.fb.group({
      to: new FormControl('', [Validators.email]),
      from: ['manuela@gmail.com'],
      subject: [''],
      body: [''],
      selectedDate: ['', [Validators.required, this.dateInPastValid]],
    });
    this.filteredOptions = this.contactCtrl.valueChanges.pipe(
      startWith(null),
      map((contact: string | null) =>
        contact ? this._filter(contact) : this.contacts.slice()
      )
    );
    this.sortedOptions$ = this.contactCtrl.valueChanges.pipe(
      startWith(null),
      map((contact: string | null) =>
        contact ? this._filter(contact) : this.contacts.slice()
      ),
      map((contacts) => this.sortContacts(contacts))
    );
  }

  ngOnInit() {
    this.route.queryParams?.subscribe((params) => {
      if (this.contactsService && this.contactsService.contacts$) {
        this.contactsService.contacts$?.subscribe((contacts) => {
          this.contacts = contacts;
        });
      }
      const emailDataString = params['emailData'];
      const isForwarding = params['isForwarding'];
      const isReply = params['isReply'];
      const isContact = params['isContact'];
      const recipient = params['to'];
      const isEditing = params['isEditing'];
      const selectedContact: Contact = {
        email: recipient,
        isFavorite: false,
        isContact: true,
        isSelected: false,
      };
      if (isReply && emailDataString) {
        const emailData = JSON.parse(emailDataString);
        const recipientContact: Contact = {
          email: emailData.from,
          isFavorite: false,
          isContact: true,
          isSelected: false,
        };
        this.newMailForm.patchValue({
          to: recipientContact,
          subject: 'Re: ' + emailData.subject,
        });
        this.selectedRecipients.push(recipientContact);
      } else if (isForwarding && emailDataString) {
        const emailData = JSON.parse(emailDataString);
        this.newMailForm.patchValue({
          subject: 'Inolter: ' + emailData.subject,
          body: 'Inoltrato:' + '(' + emailData.body + ')',
        });
      } else if (isContact && recipient) {
        this.newMailForm.patchValue({
          to: selectedContact,
        });
        this.selectedRecipients.push(selectedContact);
      } else if (isEditing && emailDataString) {
        const emailData = JSON.parse(emailDataString);
        const recipientContact: Contact = {
          email: emailData.to,
          isFavorite: false,
          isContact: true,
          isSelected: false,
        };

        this.newMailForm.patchValue({
          to: recipientContact,
          subject: emailData.subject,
          body: emailData.body,
        });
        this.selectedRecipients.push(recipientContact);
      }
    });
    setTimeout(() => {
      this.contactCtrl.updateValueAndValidity();
    }, 100);

    // console.log(this.dateSelected, this.newMailForm.get('selectedDate')?.value)
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

  isDuplicate(recipientEmail: string): boolean {
    return this.selectedRecipients.some(
      (recipient) =>
        recipient.email.toLowerCase() === recipientEmail.toLowerCase()
    );
  }

  onSubmit() {
    if (this.newMailForm.valid) {
      this.isLoading = true;
      const selectedEmail = this.newMailForm.get('to')?.value;
      this.selectedContact = this.contacts.find(
        (contact) => contact === selectedEmail
      );
      let sentMail: Mail = {
        id: this.generateRandomId(),
        from: 'manuela@gmail.com',
        to: selectedEmail.email
          ? selectedEmail.email
          : this.newMailForm.get('to')?.value,
        recipientName: this.selectedContact ? this.selectedContact : '',
        subject: this.newMailForm.get('subject')?.value,
        body: this.newMailForm.get('body')?.value,
        sent: true,
        important: false,
        isFavorite: false,
        completed: false,
        selected: false,
        folderName: this.isDraft ? 'bozze' : 'sent',
        attachment: this.selectedMail?.attachment,
        read: true,
        created: this.newMailForm.get('selectedDate')?.value,
        selectable: true,
      };
      //console.log(sentMail.to, 'onsubmit destinatario');
      this.folderService.copyEmailToFolder(sentMail, 'outgoing');
      if (this.isDraft) {
        sentMail.sent = false;
        this.folderService.addEmailToFolder(sentMail, 'bozze');
        this.folderService.copyEmailToFolder(sentMail, 'bozze');
        this.snackBar.open('Email salvata in bozze', 'Chiudi', {
          duration: 2000,
        });
      } else {
        sentMail.folderName = 'sent';
        this.folderService.addEmailToFolder(sentMail, 'sent');
        this.folderService.copyEmailToFolder(sentMail, 'sent');
        this.folderService.removeEmailFromFolder(sentMail, 'bozze');
        this.folderService.removeEmailFromFolder(sentMail, 'outgoing');
      
      }
      this.router.navigateByUrl('home');
    }
  }

  dateInPastValid(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);

    if (selectedDate < new Date()) {
      return { 'dateInPast': true };
    }

    return null;
  }

  closeModal() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: "Sei sicuro di voler uscire dall'editor?" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isDraft = true;
        this.onSubmit();
        this.router.navigateByUrl('home');
      }
    });
  }

  private _filter(value: string): Contact[] {
    const filterValue = value.toLowerCase();
    const favoriteContacts = this.contacts.filter(
      (contact) =>
        contact.isFavorite && contact.email.toLowerCase().includes(filterValue)
    );
    const otherContacts = this.contacts.filter(
      (contact) =>
        !contact.isFavorite && contact.email.toLowerCase().includes(filterValue)
    );
    return [...favoriteContacts, ...otherContacts];
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const newContact: Contact = {
        email: value.toLowerCase(),
        isFavorite: false,
        isContact: true,
        isSelected: false,
      };
      this.contacts.push(newContact);
      this.selectedRecipients.push(newContact);
      this.newMailForm.get('to')?.patchValue(value.toLowerCase());
    }
    event.chipInput!.clear();
    this.contactCtrl.setValue(null);
  }

  remove(contact: Contact): void {
    const index = this.contacts.indexOf(contact);
    if (index >= 0) {
      this.selectedRecipients.splice(index, 1);
      this.announcer.announce(`Removed ${contact}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedEmail = event.option.viewValue.trim().toLowerCase();
    if (!this.isDuplicate(selectedEmail)) {
      const existingContact = this.contacts.find(
        (contact) => contact.email.toLowerCase() === selectedEmail
      );
      if (existingContact) {
        this.selectedRecipients.push(existingContact);
        this.contactsInput!.nativeElement.value = '';
        this.contactCtrl.setValue(null);
        this.newMailForm
          .get('to')
          ?.patchValue(existingContact.email.toLowerCase());
        // console.log('destinatario', existingContact);
      }
    }
  }

  sortContacts(contacts: Contact[]): Contact[] {
    return contacts.sort((a, b) => (b.isFavorite ? 1 : -1));
  }
}
