import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrl: './note-dialog.component.scss'
})
export class NoteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { note: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
