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
import { ModalService } from 'src/app/services/modal.service';
import { FolderService } from 'src/app/services/folder.service';
import { ContactsService } from 'src/app/services/contacts.service';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contact } from 'src/app/model/contact';

@Component({
  selector: 'app-compose',
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
  sortedOptions$: Observable<Contact[]>;
  contacts: Contact[] = [];
  selectedRecipients: Contact[] = [];
  isSent: boolean = false;

  selectedContact: any;
  contactCtrl = new FormControl('');
  filteredOptions: Observable<any[]>;
  @ViewChild('contactsInput') contactsInput?: ElementRef<HTMLInputElement>;
  isDraft: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  announcer = inject(LiveAnnouncer);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private folderService: FolderService,
    private router: Router,
    private contactsService: ContactsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.newMailForm = this.fb.group({
      to: new FormControl('', [Validators.required]),
      from: ['manuela@gmail.com'],
      subject: [''],
      body: [''],
    });
    //console.log(this.newMailForm);

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
        isFavourite: false,
        isContact: true,
        isSelected: false,
      };

      if (isReply && emailDataString) {
        const emailData = JSON.parse(emailDataString);
        const recipientContact: Contact = {
          email: emailData.from,
          isFavourite: false,
          isContact: true,
          isSelected: false,
        };
        this.newMailForm.patchValue({
          to: recipientContact,
          subject: 'Re: ' + emailData.subject,
        });
        this.selectedRecipients.push(recipientContact);
        //console.log(emailDataString);
        //console.log(emailData.from, isReply);
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
       // console.log(selectedContact);
        //console.log('Recipient:', recipient);
      } else if (isEditing && emailDataString) {
        const emailData = JSON.parse(emailDataString);
        const recipientContact: Contact = {
          email: emailData.to,
          isFavourite: false,
          isContact: true,
          isSelected: false,
        };
        this.newMailForm.patchValue({
          to: recipientContact,

          subject: emailData.subject,
          body: emailData.body,
        });
        this.selectedRecipients.push(recipientContact);
       // console.log(emailDataString);
        //console.log(emailData.from, isReply);
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
  isDuplicate(recipientEmail: string): boolean {
    return this.selectedRecipients.some(
      (recipient) =>
        recipient.email.toLowerCase() === recipientEmail.toLowerCase()
    );
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
        to: selectedEmail.email,
        recipientName: this.selectedContact ? this.selectedContact : '',
        subject: this.newMailForm.get('subject')?.value,
        body: this.newMailForm.get('body')?.value,
        sent: true,
        important: false,
        isFavourite: false,
        completed: false,
        selected: false,
        folderName: this.isDraft ? 'bozze' : 'sent',
        attachment: this.selectedMail?.attachment,
        read: false,
      };

      if (this.isDraft) {
        sentMail.sent = false;
        this.folderService.copyEmailToFolder(sentMail, 'bozze');
        this.snackBar.open('Email salvata in bozze', 'Chiudi', {
          duration: 2000,
        });
      } else {
        sentMail.folderName = 'sent';
        this.folderService.copyEmailToFolder(sentMail, 'sent');
        this.snackBar.open('Email inviata con successo', 'Chiudi', {
          duration: 2000,
        });
      }

     // console.log(sentMail);
      this.router.navigateByUrl('home');
    }
  }

  closeModal() {
    if (window.confirm('Sei sicuro di voler uscire dall\'editor?')) {
      this.isDraft = true;
      this.onSubmit();
      this.modalService.closeModal();
    }
  }
  
    

  private _filter(value: string): Contact[] {
    const filterValue = value.toLowerCase();
    const favoriteContacts = this.contacts.filter(
      (contact) =>
        contact.isFavourite && contact.email.toLowerCase().includes(filterValue)
    );
    const otherContacts = this.contacts.filter(
      (contact) =>
        !contact.isFavourite &&
        contact.email.toLowerCase().includes(filterValue)
    );
    return [...favoriteContacts, ...otherContacts];
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const newContact: Contact = {
        email: value.toLowerCase(),
        isFavourite: false,
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
        const newContact: Contact = {
          email: existingContact.email,
          isFavourite: existingContact.isFavourite,
          isContact: existingContact.isContact,
          isSelected: false,
        };

        this.selectedRecipients.push(newContact);
        this.contactsInput!.nativeElement.value = '';
        this.contactCtrl.setValue(null);
      }
    }
  }

  sortContacts(contacts: Contact[]): Contact[] {
    return contacts.sort((a, b) => (b.isFavourite ? 1 : -1));
  }
}
