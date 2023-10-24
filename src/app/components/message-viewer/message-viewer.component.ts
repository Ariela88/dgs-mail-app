import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';


@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent {

  @Input() selectedMessage: Mail | null = null;
  @Output() favoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>(); 

  addToFavorites() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage }; 
      this.favoriteEmail.emit(copyOfSelectedMessage);
    }
  }
  

  
}
