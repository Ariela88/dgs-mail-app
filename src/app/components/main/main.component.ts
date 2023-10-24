import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FolderListComponent } from '../folder-list/folder-list.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageViewerComponent } from '../message-viewer/message-viewer.component';
import { FolderService } from 'src/app/services/folder.service';
//import { MatDialog } from '@angular/material/dialog';
import { ComposeComponent } from '../compose/compose.component';
import { DataService } from 'src/app/services/data.service';


import { Mail } from 'src/app/model/mail';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FolderListComponent,
    MessageListComponent,
    MessageViewerComponent,
    ComposeComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  selectedMail: Mail | null = null;
  selectedMails: Mail[] = [];
  @Output() messageOpened = new EventEmitter<Mail>();
  @Output() messageListUpdate = new EventEmitter<Mail[]>();

  constructor(
    private folderService: FolderService,
    //private dialog: MatDialog,
    private dataServ: DataService
  ) {}

  ngOnInit() {
    console.log('MainComponent ngOnInit called');
    this.folderService.selectFolder('inbox');
    this.dataServ.getMailMessage().subscribe(
      (data: Mail[]) => {
        this.selectedMails = data;
        this.selectedMails.forEach((email) => {
          this.folderService.addEmailToFolder(email);
        });
      },
      (error) => {
        console.error('Error fetching mail data: ', error);
      }
    );

    this.dataServ.sentMail$.subscribe(mail => {
      if (mail) {
        this.saveSentMail(mail);
      }})
  }

  onMessageSelected(mail: Mail) {
    this.selectedMail = mail;
  }

  onFavoriteEmailSelected(email: Mail) {
    this.folderService.moveEmailToFolder(email, 'favorites');
  }

  onFolderSelected(folderName: string) {
    this.folderService.selectFolder(folderName);
    this.selectedMails = this.folderService.getFolder();
    this.messageListUpdate.emit(this.selectedMails);
  }

  // openDialogForNewMail(): void {
  //   const dialogRef = this.dialog.open(ComposeComponent, {
  //     width: '500px',
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {});
  // }

  saveSentMail(email: Mail) {
   
    this.folderService.moveEmailToFolder(email, 'sent');
  }
  
}
