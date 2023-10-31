import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
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
export class ComposeComponent implements OnInit{
  newMailForm: FormGroup;
  @Output() emailSent: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Input() isComposeMode: boolean = true;
  @Input() writeNewMail: boolean = true;
  @Input() selectedMail: Mail | null = null;
  @Input() data: any;
  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router:Router,
    private modalService: ModalService, private el: ElementRef, private folderService:FolderService
     ) {
    this.newMailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      from:[''],
      subject: [''],
      body: [''],
    });

    this.route.queryParams.subscribe((params) => {
      this.newMailForm.patchValue({
        to: params['to'] || '',
        from:params['from'] || '',
        subject: params['subject'] || '',
        body: params['body'] || '',
      });
    });
  }
  ngOnInit() {
    if (this.selectedMail) {
      if (this.selectedMail.subject) {
        this.newMailForm.patchValue({
          to: this.selectedMail.from as string,
          subject: ('RE: ' + this.selectedMail.subject) as string,
          body: ('In risposta al tuo messaggio:\n' + this.selectedMail.body) as string,
        });
      } else{
        this.newMailForm.patchValue({
          to: this.selectedMail.to as string, 
          subject: ('(Inoltrato) ' + this.selectedMail.subject) as string,
          body: this.selectedMail.body as string,
        });
      }
    } else{
      this.newMailForm.reset({
        to: '',
        from: '',
        subject: '',
        body: ''
      });
    }
}

  

  
  onSubmit() {
    if (this.newMailForm.valid) {
      const sentMail: Mail = {
        id: '',
        from: 'mittente@esempio.com',
        to: this.newMailForm.get('to')?.value,
        subject: this.newMailForm.get('subject')?.value,
        body: this.newMailForm.get('body')?.value,
        sent: true,
        important: false,
        isFavourite: false,
        completed: false,
        selected: false,
        folderName:'inbox'
      };

      this.folderService.copyEmailToFolder(sentMail,'sent')
      this.closeModal()
      
      
   }
  
  }

  resetForm() {
    this.newMailForm.reset({
      to: '',
      from: '',
      subject: '',
      body: ''
    });
  }
  
  closeModal() {
    
    this.modalService.closeModal();
  }

  
  
}
