import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface RejectDialogData {
  documentTypeLabel: string;
}

@Component({
  selector: 'app-reject-document-dialog',
  templateUrl: './reject-document-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
})
export class RejectDocumentDialogComponent {
  reasonControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RejectDialogData,
    public dialogRef: MatDialogRef<RejectDocumentDialogComponent>
  ) {}

  confirm() {
    if (this.reasonControl.valid) {
      this.dialogRef.close(this.reasonControl.value);
    } else {
      this.reasonControl.markAsTouched();
    }
  }
}
