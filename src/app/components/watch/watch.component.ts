import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss'
})
export class WatchComponent implements OnInit {
  orario?: Date;

  constructor() { }

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); 
  }

  updateTime() {
    this.orario = new Date();
  }

}
