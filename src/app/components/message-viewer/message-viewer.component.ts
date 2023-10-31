import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { MessageActionsComponent } from '../message-actions/message-actions.component';
import { ActivatedRoute } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [CommonModule, MaterialModule, MessageActionsComponent],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss'],
})
export class MessageViewerComponent implements OnInit{


  @Input() writeNewMail: boolean = false;
  @Input() isComposeMode: boolean = false;
  @Input() selectedMessage: Mail | null = null;
  @Output() replyEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() forwardEmail: EventEmitter<Mail> = new EventEmitter<Mail>();

  constructor(private route: ActivatedRoute,private folderService:FolderService) {}

  ngOnInit() {
    const id = this.selectedMessage?.id
    this.folderService.getMailById(id!)
    console.log(this.selectedMessage)
  }
  

  
  replyToEmail() {
    this.writeNewMail = true;
    this.isComposeMode = true
    if (this.selectedMessage) {
      this.replyEmail.emit(this.selectedMessage);
    }
  }
  

  forwardMail() {
    this.writeNewMail = true;
    this.isComposeMode = true
    if (this.selectedMessage) {
      this.forwardEmail.emit(this.selectedMessage);
    }
  }
  
  
}
