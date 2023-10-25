import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mail } from 'src/app/model/mail';
import { NavActionsComponent } from '../nav-actions/nav-actions.component';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MaterialModule,NavActionsComponent],
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent  {
  
  newMailForm: FormGroup;
  @Output() sentMail: EventEmitter<Mail> = new EventEmitter<Mail>(); 
  @Output() replyEmail: EventEmitter<void> = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private route: ActivatedRoute,private router: Router) {
    this.newMailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      body: ['', Validators.required],
    });

    this.route.queryParams.subscribe(params => {
      this.newMailForm.patchValue({
        to: params['to'] || '',
        from: params['from'] || '', 
      });
    });
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
        isFavourite:false
      };
      this.sentMail.emit(sentMail);
      
    }

    this.router.navigateByUrl('home')
  }

  replyToMail() {
    console.log('compose');
    this.replyEmail.emit();
    
  }

}
