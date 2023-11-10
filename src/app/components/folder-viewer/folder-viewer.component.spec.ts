import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FolderViewerComponent } from './folder-viewer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material-module/material/material.module';

describe('FolderViewerComponent', () => {
  let component: FolderViewerComponent;
  let fixture: ComponentFixture<FolderViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FolderViewerComponent],
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule, MatIconModule,MaterialModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ folderName: 'inbox' }) },
            paramMap: {
              subscribe: (fn: (value: any) => void) => fn({ folderName: 'inbox' }),
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
