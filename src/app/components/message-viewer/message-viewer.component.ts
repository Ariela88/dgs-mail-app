import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Mail } from 'src/app/model/mail';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.scss']
})
export class MessageViewerComponent implements OnInit {
 mail!: Mail;


  constructor(private dataService: DataService, public route:ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const messageId = params['id'];
      this.dataService.getMessageById(messageId).subscribe(data => {
        console.log(data?.body)
      });
    });
  }
}  
