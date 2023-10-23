import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { Mail } from 'src/app/model/mail';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit{


  mails: Mail[] = [];

  constructor(private data: DataService, private router:Router) { }

  ngOnInit(): void {
    this.getMessage();
  }

  getMessage() {
    this.data.getMailMessage().subscribe(
      (data: Mail[]) => {
        this.mails = data;
      },
      error => {
        console.error('Error fetching mail data: ', error);
      }
    );
  }

  viewMessage(id: string) {
    this.router.navigate(['/message', id]);
  }
}
