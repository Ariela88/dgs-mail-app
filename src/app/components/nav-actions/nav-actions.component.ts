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
  @Input() set messageSelected (messaggio: Mail | undefined){
    if(messaggio){
      this.messaggio = messaggio
      this.importantButtonLabel = this.messaggio.important ? 'Rimuovi dagli Importanti' : 'Importante';
      this.favoriteButtonLabel = this.messaggio.isFavourite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti';

    }
  };
  @Output() addToFavoriteEvent: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() markAsImportantEvent: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() deleteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  favoriteButtonLabel: string = 'Aggiungi ai preferiti';
  importantButtonLabel: string = 'Importante';
  messaggio: any;
  addToFavorite() {
    if (this.messaggio) {
      this.messaggio.isFavourite = !this.messaggio.isFavourite;
      this.favoriteButtonLabel = this.messaggio.isFavourite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti';
      this.addToFavoriteEvent.emit(this.messaggio);
    }
  }

  markAsImportant() {
    
    if (this.messaggio) {
      this.messaggio.important = !this.messaggio.important;
      this.importantButtonLabel = this.messaggio.important ? 'Rimuovi dagli Importanti' : 'Importante';
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
