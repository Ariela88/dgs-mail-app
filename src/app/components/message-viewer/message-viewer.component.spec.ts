import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MessageViewerComponent } from './message-viewer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FolderService } from 'src/app/services/folder.service';
import { MaterialModule } from 'src/app/material-module/material/material.module';
import { HttpClientModule } from '@angular/common/http';

describe('MessageViewerComponent', () => {
  let component: MessageViewerComponent;
  let fixture: ComponentFixture<MessageViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageViewerComponent],
      imports: [MatDialogModule,MaterialModule,HttpClientModule],
      providers: [
        FolderService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ foldername: 'mail' }) },
          },
        },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          },
        },
      ],
    });

    fixture = TestBed.createComponent(MessageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
