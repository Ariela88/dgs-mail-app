import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, ElementRef } from '@angular/core';
import { ComposeComponent } from '../components/compose/compose.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private router: Router) {}

  openModal(data: any, el: ElementRef) {
    const modalFactory = this.componentFactoryResolver.resolveComponentFactory(ComposeComponent);
    const modalComponentRef = modalFactory.create(this.injector);
    
    modalComponentRef.instance.data = data;

    this.appRef.attachView(modalComponentRef.hostView);
    const domElem = (modalComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    el.nativeElement.appendChild(domElem); 

    modalComponentRef.onDestroy(() => {
      el.nativeElement.removeChild(domElem); 
    });
  }

  closeModal() {
    this.router.navigateByUrl('home');
  }
}
