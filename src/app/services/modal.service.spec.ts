import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service'; 
import { MatDialogModule } from '@angular/material/dialog';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers:[ModalService],
        imports: [MatDialogModule]});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});