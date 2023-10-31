import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router } from '@angular/router';
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
  
  
}
