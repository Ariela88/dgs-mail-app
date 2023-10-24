import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MaterialModule } from 'src/app/material-module/material/material.module';


@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent {

  @Input() selectedMessage: Mail | null = null;
  @Output() favoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>(); 
  @Output() importantEmail: EventEmitter<Mail> = new EventEmitter<Mail>(); 

  addToFavorites() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage }; 
      this.favoriteEmail.emit(copyOfSelectedMessage);
    }
  }
  
  markAsImportant() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage }; 
      this.importantEmail.emit(copyOfSelectedMessage);
    }
  }
  

  
}
