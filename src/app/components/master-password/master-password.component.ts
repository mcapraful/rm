import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';
@Component({
  selector: 'app-master-password',
  templateUrl: './master-password.component.html',
  styleUrls: ['./master-password.component.css'],
})
export class MasterPasswordComponent implements OnInit {
  constructor(
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MasterPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  openSnackBar(message: string, className: string): void {
    const snackBarConfigObject = {
      duration: 3000,
      data: message,
      panelClass: className,
    };
    this.matSnackBar.openFromComponent(SnackbarComponent, snackBarConfigObject);
  }

  onSubmit(): void {
    if (this.data.password == sessionStorage.getItem('password')) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }
}
