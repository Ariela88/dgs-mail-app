import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MessageViewerComponent } from './message-viewer.component';
import { FolderService } from 'src/app/services/folder.service';
import { HttpClientModule } from '@angular/common/http';

describe('MessageViewerComponent', () => {
  let component: MessageViewerComponent;
  let fixture: ComponentFixture<MessageViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageViewerComponent],
      imports: [HttpClientModule],
      providers: [
        FolderService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id:'1', foldername: 'inbox' }) },
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
