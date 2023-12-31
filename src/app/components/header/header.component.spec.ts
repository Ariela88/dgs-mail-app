import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component'; 
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { AppModule } from 'src/app/app.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [HeaderComponent],
        imports:[MaterialModule,AppModule]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});