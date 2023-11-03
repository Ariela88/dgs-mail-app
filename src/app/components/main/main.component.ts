import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FolderListComponent } from '../folder-list/folder-list.component';
import { MessageViewerComponent } from '../message-viewer/message-viewer.component';
import { MessageActionsComponent } from '../message-actions/message-actions.component';
import { FolderService } from 'src/app/services/folder.service';
import { ComposeComponent } from '../compose/compose.component';
import { DataService } from 'src/app/services/data.service';
import { FormsModule } from '@angular/forms';
import { Mail } from 'src/app/model/mail';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FolderListComponent,
    MessageViewerComponent,
    ComposeComponent,
    FormsModule,
    MessageActionsComponent,
    RouterModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  selectedMails: Mail[] = [];

  constructor(
    private folderService: FolderService,
    private dataServ: DataService
  ) {}

  ngOnInit() {
    const foldername = '';
    this.dataServ.getMailMessage().subscribe(
      (data: Mail[]) => {
        this.selectedMails = [...data];
        this.selectedMails.forEach((email) => {
          this.folderService.addEmailToFolder(email, foldername);
        });
      },
      (error) => {
        console.error('Error fetching mail data: ', error);
      }
    );
  }
}
