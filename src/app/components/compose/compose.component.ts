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
export class ComposeComponent {
  newMailForm: FormGroup;
  @Output() emailSent: EventEmitter<Mail> = new EventEmitter<Mail>();
  
  @Input() isComposeMode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.newMailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      subject: [''],
      body: [''],
      from: [''],
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

  onSubmit() {
    if (this.newMailForm.valid) {
      console.log('mandata');
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
        selected:false
      };
      
      this.emailSent.emit(sentMail);
      console.log(sentMail);
    }
    this.router.navigateByUrl('home');
  }
}
