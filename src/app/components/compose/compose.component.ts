import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mail } from 'src/app/model/mail';

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MaterialModule],
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent {
  
  newMailForm: FormGroup
  @Input() selectedMessage: Mail | null = null;
  @Output() sentMail: EventEmitter<Mail> = new EventEmitter<Mail>(); 

  constructor(
   
    private fb: FormBuilder ) {
    this.newMailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  
  onSubmit() {
    if (this.newMailForm.valid) {
      const sentMail: Mail = {
        id: this.selectedMessage?.id || '',
        from: 'mittente@esempio.com',
        to: this.newMailForm.get('to')?.value,
        subject: this.newMailForm.get('subject')?.value,
        body: this.newMailForm.get('body')?.value,
        sent: true,
        important: false
      };
  
      this.sentMail.emit(sentMail);
    }
  }
  
  
  
  

}
