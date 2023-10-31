import { Component, ElementRef } from '@angular/core';
import { ModalService } from './services/modal.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dgs-mail-app';

  constructor(private modalService: ModalService, private el: ElementRef) {}

  openModal() {
    const data = {
      title: 'Nuova Mail',
    
    };
    this.modalService.openModal(data, this.el);
  }

 
}
