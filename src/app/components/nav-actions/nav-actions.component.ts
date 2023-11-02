import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';

@Component({
  selector: 'app-nav-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-actions.component.html',
  styleUrls: ['./nav-actions.component.scss'],
})
export class NavActionsComponent {
  @Input() messageSelected?: Mail | undefined;
  favoriteEmail: Mail[] = [];
  @Output() addToFavoriteEvent: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() markAsImportantEvent: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() deleteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();

  addToFavorite() {
    if (this.messageSelected) {
      this.addToFavoriteEvent.emit(this.messageSelected);
    }
 }

  markAsImportant() {
    
    if (this.messageSelected) {
      this.markAsImportantEvent.emit(this.messageSelected);
    }
    
  }

  removeFromfavorite() {
    if (this.messageSelected) {
      this.messageSelected.isFavourite = false;
    }
  }

  unMarkAsImportant() {
    if (this.messageSelected) {
      this.messageSelected.important = false;
    }
  }


}
