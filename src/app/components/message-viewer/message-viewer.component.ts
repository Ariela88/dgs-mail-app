import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { MessageActionsComponent } from '../message-actions/message-actions.component';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [CommonModule,MaterialModule,MessageActionsComponent],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent {

  @Input() selectedMessage: Mail | null = null;
  @Input() favoriteMessages: Mail[] = []; 
  @Output() favoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>(); 
  @Output() removeFavoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>(); 
  @Output() importantEmail: EventEmitter<Mail> = new EventEmitter<Mail>(); 
  @Output() replyEmail: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router:Router, private storage:StorageService){}

  addToFavorites() {
    if (this.selectedMessage && !this.selectedMessage.isFavourite) {
        this.storage.saveMailInFavourites(this.selectedMessage);
        this.selectedMessage.isFavourite = true;
    } else if (this.selectedMessage && this.selectedMessage.isFavourite) {
        this.storage.removeMailToFavourites(this.selectedMessage);
        this.selectedMessage.isFavourite = false;
    }
}


  
  removeFromFavorites() {
    if (this.selectedMessage?.isFavourite) {
     this.storage.removeMailToFavourites(this.selectedMessage)
    }
  }
  

//   isMessageInFavorites(message: Mail): boolean {
//     return this.favoriteMessages.some(favorite => favorite.id === message.id);
// }

  
  markAsImportant() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage }; 
      this.importantEmail.emit(copyOfSelectedMessage);
    }
  }
  
  replyToEmail() {
    console.log('reply viewer');
    this.replyEmail.emit();
    if (this.selectedMessage) {
      this.router.navigate(['/editor'], {
        queryParams: { to: this.selectedMessage.from,
          from: this.selectedMessage.to  }
      });
    }
  }


  
}
