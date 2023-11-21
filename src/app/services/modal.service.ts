import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private router: Router
  ) {}


  closeModal() {
    this.router.navigateByUrl('home');
      }
}
