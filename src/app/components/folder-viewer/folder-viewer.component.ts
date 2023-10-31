import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from 'src/app/services/folder.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-folder-viewer',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './folder-viewer.component.html',
  styleUrls: ['./folder-viewer.component.scss']
})
export class FolderViewerComponent implements OnInit {
  emails: Mail[] = [];
  folderName: string = 'inbox';
  selectAllChecked: boolean = false;

  @Input() selectedMessage: Mail | null = null;
  @Output() messageSelectedOut = new EventEmitter<Mail>();
  @Output() messageDelete = new EventEmitter<Mail>();
  @Input() favoriteMessages: Mail[] = [];
  @Output() favoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() removeFavoriteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() removeImportantEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() deleteEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Output() importantEmail: EventEmitter<Mail> = new EventEmitter<Mail>();
  @Input() messageSelected: Mail[] = [];
  @Output() messageListUpdate = new EventEmitter<Mail[]>();
  @Input() set updateMessages(messages: Mail[]) {
    if (messages && messages.length > 0) {
      this.messageSelected = messages;
    }
  }



  viewMessage(mail: Mail) {
    this.messageSelectedOut.emit(mail);
  }

  updateMessageList(messages: Mail[]) {
    this.messageListUpdate.emit(messages);
  }

  checkAll() {
    this.selectAllChecked = !this.selectAllChecked;

    for (let i = 0; i < this.messageSelected.length; i++) {
      this.messageSelected[i].selected = this.selectAllChecked;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private folderServ:FolderService,
    private router:Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const folderName = params['folderName'];
      this.emails = this.folderServ.getEmails(folderName);
    });
  }

  selectedMail(mailId: string) {
    this.router.navigate(['folder', this.folderName, 'mail', mailId]);
  }

  addToFavorite() {
    this.messageSelected.forEach((email) => {
      if (email.selected) {
        const copyOfSelectedMessage: Mail = { ...email };
        this.favoriteEmail.emit(copyOfSelectedMessage);
        email.isFavourite = true;
        email.folderName = 'preferiti'
      }
    });

  }

  markAsImportant() {
    this.messageSelected.forEach((email) => {
      if (email.selected) {
        const copyOfSelectedMessage: Mail = { ...email };
        this.importantEmail.emit(copyOfSelectedMessage);
        email.important = true;
        email.folderName = 'important'
      }
    });

  }

  removeFromfavorite() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage };
      this.removeFavoriteEmail.emit(copyOfSelectedMessage);
      this.selectedMessage.isFavourite = false;
    }
    for (let i = 0; i < this.messageSelected.length; i++) {
      if (this.messageSelected[i].selected) {
        this.messageSelected[i].isFavourite = false;
      } 
    }
    

  }

  unMarkAsImportant() {
    if (this.selectedMessage) {
      const copyOfSelectedMessage: Mail = { ...this.selectedMessage };
      this.removeImportantEmail.emit(copyOfSelectedMessage);
      this.selectedMessage.important = false;
    }
    for (let i = 0; i < this.messageSelected.length; i++) {
      if (this.messageSelected[i].selected) {
        this.messageSelected[i].important = false;
      }
    }
  
  }

  deleteMail() {
    const selectedMessagesCopy = [...this.messageSelected];
    for (let i = 0; i < selectedMessagesCopy.length; i++) {
      if (selectedMessagesCopy[i].selected) {
        this.deleteEmail.emit(selectedMessagesCopy[i]);
      
      }
    } 
  }
  
  
}
