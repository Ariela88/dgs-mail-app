import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { Router } from '@angular/router';
import { Mail } from 'src/app/model/mail';
import { FolderService } from 'src/app/services/folder.service';


@Component({
  selector: 'app-folder-list',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent{
  
  @Output() folderSelected = new EventEmitter<string>();

  folders?: any[];
  email?: Mail;

  constructor(private router: Router, private folderService:FolderService) {}

  changeFolder(folderName: string) {
     if (this.email) {
      this.folderService.getEmails(folderName);
    } else {
      console.log('Email non definita');
    }
    
    this.router.navigate(['folders', folderName]);
  }

  

}
