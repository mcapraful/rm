import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpParams } from '@angular/common/http';
import { AccountsService } from 'src/app/services/accounts-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/components/snackbar/snackbar.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showPassword = false;
  loginForm: FormGroup;
  loggedInUserInfo;
  loading = false;
  constructor(
    private readonly authService: AuthServiceService,
    private readonly router: Router,
    private readonly accountService: AccountsService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initLoginForm();
    //this.skipLogin();
  }

  skipLogin(): void {
    const token = this.authService.getToken();
    if (token) {
      const accountType = this.authService.getAccountType();
      if (accountType !== 'User') {
        this.router.navigate(['/home/dashboard']);
      } else if (accountType === 'User') {
        this.router.navigate(['/home/user/user-dashboard']);
      }
    }
  }

  initLoginForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onLoginClick() {
    const params = new HttpParams()
      .set('username', this.loginForm.value.username)
      .set('password', this.loginForm.value.password)
      .set('grant_type', 'password');
    this.loading = true;
    this.authService.onLogin(params).subscribe(
      (loginRes: any) => {
        if (loginRes.access_token !== '') {
          sessionStorage.setItem('token', loginRes.access_token);
          sessionStorage.setItem('username', this.loginForm.value.username);
          sessionStorage.setItem('password', this.loginForm.value.password);
          this.accountService.getLoggedInUserDetails().subscribe(
            (userDetailsRes) => {
              this.loading = false;
              if (userDetailsRes['success']) {
                sessionStorage.setItem(
                  'accountType',
                  userDetailsRes['user'].accountType
                );
                this.loggedInUserInfo = this.accountService.loggedInUserDetails =
                  userDetailsRes['user'];
                sessionStorage.setItem('accountType', userDetailsRes['user'].accountType);
                console.log('Role ::', this.loggedInUserInfo);
                if (!this.loggedInUserInfo.isPasswordSet) {
                  this.router.navigate(['/change-password']);
                } else {
                  if (this.loggedInUserInfo.accountType !== 'User') {
                    this.router.navigate(['/home/dashboard']);
                  } else if (this.loggedInUserInfo.accountType === 'User') {
                    this.router.navigate(['/home/user/user-dashboard']);
                  }
                }
              } else if (userDetailsRes['error']) {
                this.openSnackBar(
                  'Error occured while fetching user details',
                  'error'
                );
                console.log(
                  'Error occured while fetching user details',
                  userDetailsRes
                );
              }
            },
            (userDetailsErrorRes) => {
              this.loading = false;
              this.openSnackBar(
                'Error occured while fetching user details',
                'error'
              );
              console.log(
                'Error occured while fetching user details',
                userDetailsErrorRes
              );
            }
          );
        }
      },
      (loginErrorRes: any) => {
        this.loading = false;
        this.openSnackBar(
          loginErrorRes.error.error_description ||
          'Something went wrong while login',
          'error'
        );
        console.log('Error in login::', loginErrorRes);
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
}
