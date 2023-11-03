import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { NavActionsComponent } from '../nav-actions/nav-actions.component';
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

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NavActionsComponent,
    FormsModule,
  ],
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
})
export class ComposeComponent implements OnInit {
  newMailForm: FormGroup;
  @Output() emailSent: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Input() isComposeMode: boolean = true;
  @Input() writeNewMail: boolean = true;
  @Input() selectedMail?: Mail | null = null;
  @Input() data: any;
  contacts: string[] = [];
  selectedRecipients: any[] = [];
  selectedContact: any;
  myContacts?: Observable<any[]>;
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
    private cdr: ChangeDetectorRef
  ) {
    this.newMailForm = this.fb.group({
      to: [
        this.contacts.length > 0 ? this.contacts : '',
        [Validators.required],
      ],
      from: [''],
      subject: [''],
      body: [''],
      originalMessageAttachment: [''],
    });

    this.route.queryParams.subscribe((params) => {
      const recipient = params['to'];
      console.log('Recipient:', recipient);

      this.newMailForm.patchValue({
        to: params['to'] || '',
        from: params['from'] || '',
        subject: params['subject'] || '',
        body: params['body'] || '',
      });
    });
    this.filteredOptions = this.contactCtrl.valueChanges.pipe(
      startWith(null),
      map((contact: string | null) =>
        contact ? this._filter(contact) : this.contacts.slice()
      )
    );
  }
  ngOnInit() {
    this.contactsService.contacts$.subscribe((contacts) => {
      console.log('Contatti nel componente Compose:', contacts);
      this.contacts = contacts;
      this.cdr.detectChanges();

      this.myContacts = this.contactCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    });

    this.route.queryParams.subscribe((params) => {
      const emailDataString = params['emailData'];
      const isForwarding = params['isForwarding'];
    
      if (emailDataString) {
        const emailData = JSON.parse(emailDataString);
        this.newMailForm.patchValue({
          to: emailData.to,
          subject: isForwarding
            ? 'Inolter: ' + emailData.subject
            : 'Re: ' + emailData.subject,
          body: isForwarding ? 'Inoltrato:' + '(' + emailData.body + ')' : '',
          originalMessageAttachment: emailData.body,
        });
      } else {
        console.log('Errore nel compose');
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
        from: 'mittente@esempio.com',
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
      };

      this.folderService.copyEmailToFolder(sentMail, 'sent');
      sentMail.folderName = 'sent';
      console.log(sentMail);
      this.router.navigateByUrl('home');
    }
  }

  closeModal() {
    const isConfirmed = window.confirm(
      "Sei sicuro di voler uscire dall'editor?"
    );
    if (isConfirmed) {
      this.modalService.closeModal();
    }
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.contacts.filter((contact) => {
      return contact && contact.toLowerCase().includes(filterValue);
    });
  }

  displayContact(contact: any): string {
    if (contact) {
      return `${contact}`;
    }
    return '';
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.contacts.push(value);
      console.log(this.contacts);
    }
    event.chipInput!.clear();

    this.contactCtrl.setValue(null);
  }

  remove(contact: string): void {
    const index = this.contacts.indexOf(contact);

    if (index >= 0) {
      this.contacts.splice(index, 1);

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
        this.filteredOptions = this.contactCtrl.valueChanges.pipe(
          startWith(null),
          map((contact: string | null) =>
            contact ? this._filter(contact) : this.contacts.slice()
          )
        );
      }
    }

    this.contactsInput!.nativeElement.value = '';
    this.contactCtrl.setValue(null);
  }
}
