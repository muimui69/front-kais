import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',

})
export class DialogComponent {
  constructor(public dialog: MatDialog) { }

  openDialogSuccess(message: string, title: string) {
    this.dialog.open(DialogElementsSuccess, {
      data: { message, title }
    });
  }

  openDialogError(message: string, title: string) {
    this.dialog.open(DialogElementsError, {
      data: { message, title }
    });
  }
  openDialogErrorsList(message: string, title: string, errors: string[]) {
    this.dialog.open(DialogElementsErrorsList, {
      data: { message, title, errors },
    });
  }

  openDialogQuestion(message: string, title: string): MatDialogRef<DialogElementsQuestion, any> {
    return this.dialog.open(DialogElementsQuestion, {
      data: { message, title }
    });
  }

  openDialogWarning(message: string, title: string): MatDialogRef<DialogElementsWarning, any> {
    return this.dialog.open(DialogElementsWarning, {
      data: { message, title }
    });
  }

  openDialogUnpaidInvoices(message: string, title: string, invoices: { number: string; date_doc: string; date_exp: string }[]) {
    this.dialog.open(DialogElementsUnpaidInvoices, {
      data: { message, title, invoices }
    });
  }
}

@Component({
  selector: 'dialog-elements-success-dialog',
  templateUrl: 'dialog-success.html',
  styleUrl: 'dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class DialogElementsSuccess {
  public message: string = '';
  public title: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogElementsSuccess>) {
    this.message = data.message;
    this.title = data.title;
  }
}

@Component({
  selector: 'dialog-elements-error-dialog',
  templateUrl: 'dialog-error.html',
  styleUrl: 'dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class DialogElementsError {
  public message: string = '';
  public title: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogElementsError>) {
    this.message = data.message;
    this.title = data.title;
  }
}

@Component({
  selector: './dialog-elements-errors-list-dialog',
  templateUrl: 'dialog-errors-list.html',
  styleUrl: 'dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MaterialModule, MatIconModule],
})
export class DialogElementsErrorsList {
  public message: string = '';
  public title: string = '';
  public errors: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogElementsErrorsList>) {
    this.message = data.message;
    this.title = data.title;
    this.errors = data.errors || [];
  }
}

@Component({
  selector: 'dialog-elements-question-dialog',
  templateUrl: 'dialog-question.html',
  styleUrl: 'dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class DialogElementsQuestion {
  public message: string = '';
  public title: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogElementsQuestion>) {
    this.message = data.message;
    this.title = data.title;
  }
}

@Component({
  selector: 'dialog-elements-warning-dialog',
  templateUrl: 'dialog-warning.html',
  styleUrl: 'dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class DialogElementsWarning {
  public message: string = '';
  public title: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogElementsWarning>) {
    this.message = data.message;
    this.title = data.title;
  }
}

@Component({
  selector: 'dialog-elements-unpaid-invoices-dialog',
  templateUrl: 'dialog-unpaid-invoices.html',
  styleUrl: 'dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MaterialModule, MatButtonModule, MatIconModule],
})
export class DialogElementsUnpaidInvoices {
  public message: string = '';
  public title: string = '';
  public invoices: { number: string; date_doc: string; date_exp: string }[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogElementsUnpaidInvoices>) {
    this.message = data.message;
    this.title = data.title;
    this.invoices = data.invoices || [];
  }
}
