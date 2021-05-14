import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts-service';
import { ActionsServiceService } from 'src/app/services/actions-service.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-mandatory-change-password',
  templateUrl: './mandatory-change-password.component.html',
  styleUrls: ['./mandatory-change-password.component.css'],
})
export class MandatoryChangePasswordComponent implements OnInit {
  loggedInUserInfo;
  showPassword = false;
  showConfirmPassword = false;
  mandatoryPasswordChangeForm: FormGroup;
  loading$: Observable<boolean>;

  constructor(
    private readonly actionService: ActionsServiceService,
    private readonly accountService: AccountsService,
    private readonly matSnackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getLoggedInUserdetails();
    this.initPasswordChangeForm();
  }

  initPasswordChangeForm() {
    this.mandatoryPasswordChangeForm = new FormGroup({
      newPass: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      confirmPass: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
    });
  }

  getLoggedInUserdetails() {
    if (this.accountService.loggedInUserDetails) {
      this.loggedInUserInfo = this.accountService.loggedInUserDetails;
    } else {
      this.loading$ = of(true);
      this.accountService.getLoggedInUserDetails().subscribe(
        (res) => {
          if (res['success']) {
            this.loggedInUserInfo = this.accountService.loggedInUserDetails =
              res['user'];
            console.log(this.loggedInUserInfo);
            this.loading$ = of(false);
          } else if (res['error']) {
            this.loading$ = of(false);
            console.log('Error occured while fetching user details', res);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onSubmit() {
    this.loading$ = of(true);
    const payload = {
      userId: this.loggedInUserInfo.id,
      newPassword: this.mandatoryPasswordChangeForm.get('newPass').value,
    };
    this.actionService.onChangePassword(payload).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading$ = of(false);
          this.getUpdateUserDetails();
          this.openSnackBar('User password updated successfully', 'success');
          if (this.loggedInUserInfo.accountType === 'User') {
            this.router.navigate(['/home/user/user-dashboard']);
          } else if (this.loggedInUserInfo.accountType !== 'User') {
            this.router.navigate(['/home/dashboard']);
          }
        } else if (res.error) {
          this.loading$ = of(false);
          this.openSnackBar('Error occured while updating password', 'error');
        }
      },
      (err) => {
        this.loading$ = of(false);
        this.openSnackBar('Error occured while updating password', 'error');
        console.log('Error in login::', err);
      }
    );
  }

  openSnackBar(message: string, className: string) {
    const snackBarConfigObject = {
      duration: 3000,
      data: message,
      panelClass: className,
    };
    this.matSnackBar.openFromComponent(SnackbarComponent, snackBarConfigObject);
  }

  getErrorMessage(field: string) {
    if (this.mandatoryPasswordChangeForm?.get(field)?.hasError('pattern')) {
      return 'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.';
    } else if (
      this.mandatoryPasswordChangeForm?.get(field)?.hasError('required')
    ) {
      return 'Please enter password';
    }
  }

  onResetClick() {
    this.mandatoryPasswordChangeForm.reset();
  }

  getUpdateUserDetails() {
    this.accountService.getLoggedInUserDetails().subscribe((res) => {
      this.loggedInUserInfo = this.accountService.loggedInUserDetails =
        res['user'];
    });
  }
}
