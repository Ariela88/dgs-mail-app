import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MessageViewerComponent } from '../message-viewer/message-viewer.component';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageViewerComponent],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent {
  @Output() messageSelectedOut = new EventEmitter<Mail>();
  @Input() messageSelected: Mail[] = [];
  @Input() set updateMessages(messages: Mail[]) {
    if (messages && messages.length > 0) {
      this.messageSelected = messages;
    }
  }

  viewMessage(mail: Mail) {
    console.log(this.messageSelected);
    this.messageSelectedOut.emit(mail);
  }
}
