import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon'; 
import { MessageActionsComponent } from './message-actions.component';

describe('MessageActionsComponent', () => {
  let component: MessageActionsComponent;
  let fixture: ComponentFixture<MessageActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [MessageActionsComponent],
        imports:[MatIconModule]
    });
    fixture = TestBed.createComponent(MessageActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});