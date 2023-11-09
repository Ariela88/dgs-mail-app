import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { Contact } from 'src/app/model/contact';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-actions',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './contact-actions.component.html',
  styleUrls: ['./contact-actions.component.scss']
})
export class ContactActionsComponent {
  @Input() contact?: Contact;
  @Output() toggleFavoriteOut: EventEmitter<Contact> = new EventEmitter<Contact>();


  toggleFavorite() {
    if (this.contact) {
      this.contact.isFavourite = !this.contact.isFavourite;
      this.toggleFavoriteOut.emit(this.contact);
    }
  }

 
}
