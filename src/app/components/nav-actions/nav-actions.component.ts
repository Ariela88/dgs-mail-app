import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-actions.component.html',
  styleUrls: ['./nav-actions.component.scss']
})
export class NavActionsComponent {

  @Output() replyMail: EventEmitter<void> = new EventEmitter<void>(); 

  reply() {
  
    this.replyMail.emit(); 
  }

  inolter(){}

}
