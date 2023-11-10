import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderListComponent } from './folder-list.component'; 
import { MatIconModule } from '@angular/material/icon';

describe('FolderListComponent', () => {
  let component: FolderListComponent;
  let fixture: ComponentFixture<FolderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [FolderListComponent],
        imports:[MatIconModule]
    });
    fixture = TestBed.createComponent(FolderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});