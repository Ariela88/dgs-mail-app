import { TestBed } from '@angular/core/testing';

import { FolderService } from './folder.service'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

describe('FolderService', () => {
  let service: FolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers:[FolderService],
        imports: [MatDialogModule]});
    service = TestBed.inject(FolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});