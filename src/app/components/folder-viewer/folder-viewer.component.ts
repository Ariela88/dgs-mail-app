import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-folder-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder-viewer.component.html',
  styleUrls: ['./folder-viewer.component.scss']
})
export class FolderViewerComponent implements OnInit {
  emails: Mail[] = [];
  folderName: string = 'inbox';  



  constructor(private folderServ: FolderService) { }

  ngOnInit() {
    this.folderServ.folderName$.subscribe(folderName => {
      console.log('Nuova cartella:', folderName);
      this.folderServ.getEmailsObservable(folderName).subscribe((emails: Mail[]) => {
        this.emails = emails;
        console.log('Emails in FolderViewerComponent:', this.emails);
      });
    });
    

    
    
  }
  
}
