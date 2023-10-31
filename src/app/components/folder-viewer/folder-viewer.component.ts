import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.emails = data['emails'];
      console.log('Emails:', this.emails); 
    });
  }
  
  
}
