import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalService } from './services/modal.service';
import { DataService } from './services/data.service';
import { FolderService } from './services/folder.service';
import { Mail } from './model/mail';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'dgs-mail-app';
 
}
