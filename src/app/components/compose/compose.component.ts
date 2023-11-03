import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import {
  FormBuilder,
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

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NavActionsComponent,
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
  contacts: any[] = [];
  selectedRecipients: any[] = [];
 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private folderService: FolderService,
    private router:Router,
    private contactsService: ContactsService
  ) {
    this.newMailForm = this.fb.group({
      to: [this.contacts.length > 0 ? this.contacts[0].email : '', [Validators.required, Validators.email]],
      from: [''],
      subject: [''],
      body: [''],
      originalMessageAttachment: ['']
    });

    this.route.queryParams.subscribe((params) => {
      this.newMailForm.patchValue({
        to: params['to'] || '',
        from: params['from'] || '',
        subject: params['subject'] || '',
        body: params['body'] || '',
      });
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const emailData = params['emailData'];
      const isForwarding = params['isForwarding'];
      if (emailData) {
        this.newMailForm.patchValue({
          to: emailData.to,
          subject: isForwarding
            ? 'Inolter: ' + emailData.subject
            : 'Re: ' + emailData.subject,
          body: isForwarding 
            ? 'Inoltrato:' + '('+emailData.body + ')'
            : '',
            originalMessageAttachment: emailData.body
        });
      } else {
        console.log('Errore nel compose');
      }
    });

    this.contactsService.contacts$.subscribe((contacts) => {
      this.contacts = contacts;});
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
      const selectedContact = this.contacts.find(contact => contact.email === selectedEmail);
      const sentMail: Mail = {
        id: this.generateRandomId(),
        from: 'mittente@esempio.com',
        to: selectedEmail,
        recipientName: selectedContact ? selectedContact.name : '',
        subject: this.newMailForm.get('subject')?.value,
        body: this.newMailForm.get('body')?.value,
        sent: true,
        important: false,
        isFavourite: false,
        completed: false,
        selected: false,
        folderName: 'sent',
        attachment: this.selectedMail?.attachment
      };

      this.folderService.copyEmailToFolder(sentMail, 'sent');
      sentMail.folderName = 'sent'
      console.log(sentMail);
      this.router.navigateByUrl('home')
      
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

  addRecipient(event: any) {
    const selectedContact = event.value;
    if (!this.selectedRecipients.some(recipient => recipient.email === selectedContact.email)) {
      this.selectedRecipients.push(selectedContact);
    }
    
    this.newMailForm.get('to')?.setValue('');
  }

  removeRecipient(recipient: any) {
    const index = this.selectedRecipients.indexOf(recipient);
    if (index >= 0) {
      this.selectedRecipients.splice(index, 1);
    }
  }

  
}  