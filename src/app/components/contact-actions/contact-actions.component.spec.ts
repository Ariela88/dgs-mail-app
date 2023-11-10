import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactActionsComponent } from './contact-actions.component'; 
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material-module/material/material.module';

describe('ContactActionsComponent', () => {
  let component: ContactActionsComponent;
  let fixture: ComponentFixture<ContactActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactActionsComponent],
      imports:[HttpClientTestingModule,MaterialModule]
    });
    fixture = TestBed.createComponent(ContactActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});