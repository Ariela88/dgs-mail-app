import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { Router } from '@angular/router';
import { Mail } from 'src/app/model/mail';
import { FolderViewerComponent } from '../folder-viewer/folder-viewer.component';

@Component({
  selector: 'app-folder-list',
  standalone: true,
  imports: [CommonModule,MaterialModule,FolderViewerComponent],
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent{
  folders?: any[];
  email?: Mail;

  constructor(private router: Router) {}

  changeFolder(folderName: string) {  
    this.router.navigate(['/folder', folderName]);
  }
 
}
