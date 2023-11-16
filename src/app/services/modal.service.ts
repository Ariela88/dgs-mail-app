import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ElementRef,
} from '@angular/core';
import { ComposeComponent } from '../components/compose/compose.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private router: Router
  ) {}

  openModal(data: any, el: ElementRef) {
    
              }

  closeModal() {
    this.router.navigateByUrl('home');
      }
}
