import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FolderListComponent } from '../folder-list/folder-list.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageViewerComponent } from '../message-viewer/message-viewer.component';
import { Mail } from 'src/app/model/mail';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule,MaterialModule,FolderListComponent,MessageListComponent,MessageViewerComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  selectedMessage: Mail | null = null;

}
