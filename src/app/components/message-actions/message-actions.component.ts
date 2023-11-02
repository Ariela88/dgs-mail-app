import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { Mail } from 'src/app/model/mail';

@Component({
  selector: 'app-message-actions',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './message-actions.component.html',
  styleUrls: ['./message-actions.component.scss'],
})
export class MessageActionsComponent {
  @Output() replyMail: EventEmitter<void> = new EventEmitter<void>();
  @Output() forwardMail: EventEmitter<void> = new EventEmitter<void>();
  @Input() set messageSelected(messaggio: Mail | undefined) {
    if (messaggio) {
      this.messaggio = messaggio;
      this.importantButtonLabel = this.messaggio.important
        ? 'Rimuovi dagli Importanti'
        : 'Importante';
      this.favoriteButtonLabel = this.messaggio.isFavourite
        ? 'Rimuovi dai preferiti'
        : 'Aggiungi ai preferiti';
    }
  }
  @Output() addToFavoriteEvent: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() markAsImportantEvent: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() deleteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  favoriteButtonLabel: string = 'Aggiungi ai preferiti';
  importantButtonLabel: string = 'Importante';
  messaggio: any;

  reply() {
    this.replyMail.emit();
  }

  inolter() {
    this.forwardMail.emit();
  }

  addToFavorite() {
    if (this.messaggio) {
      this.messaggio.isFavourite = !this.messaggio.isFavourite;
      this.favoriteButtonLabel = this.messaggio.isFavourite
        ? 'Rimuovi dai preferiti'
        : 'Aggiungi ai preferiti';
      this.addToFavoriteEvent.emit(this.messaggio);
    }
  }

  markAsImportant() {
    if (this.messaggio) {
      this.messaggio.important = !this.messaggio.important;
      this.importantButtonLabel = this.messaggio.important
        ? 'Rimuovi dagli Importanti'
        : 'Importante';
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
