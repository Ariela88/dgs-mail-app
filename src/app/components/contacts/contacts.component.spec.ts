import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsComponent } from './contacts.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { FormsModule } from '@angular/forms';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactsComponent],
      imports: [HttpClientModule,MaterialModule,FormsModule], 
    });
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
