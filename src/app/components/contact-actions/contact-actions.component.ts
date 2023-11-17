import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from 'src/app/model/contact';

@Component({
  selector: 'app-contact-actions',
  templateUrl: './contact-actions.component.html',
  styleUrls: ['./contact-actions.component.scss'],
})
export class ContactActionsComponent {
  @Input() contact?: Contact;
  @Output() toggleFavoriteOut: EventEmitter<Contact> =
    new EventEmitter<Contact>();

  toggleFavorite() {
    if (this.contact) {
      this.contact.isFavorite = !this.contact.isFavorite;
      this.toggleFavoriteOut.emit(this.contact);
    }
  }
}
