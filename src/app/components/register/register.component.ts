import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PassAndConfirmPassValidator } from '../../validators/pass-confirPass-validator';
import { MasterPasswordComponent } from '../master-password/master-password.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterServiceService } from '../../services/register-service.service';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountsService } from 'src/app/services/accounts-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  loggedInUserDetails;
  isSelectedAccountTypeUser;
  showPassword = false;
  showConfirmPassword = false;
  accountTypes = [
    {
      displayValue: 'SuperMaster',
      value: 'SuperMaster',
    },
    {
      displayValue: 'Master',
      value: 'Master',
    },
    {
      displayValue: 'Agent',
      value: 'Agent',
    },
    {
      displayValue: 'User',
      value: 'User',
    },
  ];

  loading$: Observable<boolean>;
  passErrorMessage: string;
  registerForm: FormGroup;
  @ViewChild('formGroupDirective', { static: false }) registerFormDirective;

  constructor(
    public readonly dialog: MatDialog,
    private readonly registerService: RegisterServiceService,
    private router: Router,
    private accountService: AccountsService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.accountService.loggedInUserDetails) {
      this.loggedInUserDetails = this.accountService.loggedInUserDetails;
      this.getAccountTypeArray();
    } else {
      this.loading$ = of(true);
      this.accountService.getLoggedInUserDetails().subscribe((userDetails) => {
        this.loading$ = of(false);
        this.loggedInUserDetails = userDetails['user'];
        this.getAccountTypeArray();
        this.registerForm.patchValue(
          { our: this.loggedInUserDetails.ourPercentage },
          { emitEvent: false }
        );
        this.registerForm.patchValue(
          { upline: this.loggedInUserDetails.uplinePercentage },
          { emitEvent: false }
        );
        this.registerForm
          .get('downline')
          .setValidators([
            Validators.required,
            Validators.max(this.loggedInUserDetails?.ourPercentage - 1),
          ]);
        this.registerForm
          .get('creditReference')
          .setValidators([
            Validators.required,
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
            Validators.max(this.loggedInUserDetails?.availableBalance),
          ]);
      });
    }
    this.initRegisterForm();
    this.registerForm.valueChanges.subscribe((formObject) => {
      if (formObject.commLimit) {
        this.registerForm.get('downline').clearValidators();
        this.registerForm.get('downline').disable({ emitEvent: false });
        this.registerForm
          .get('downline')
          .updateValueAndValidity({ emitEvent: false });
      }
      if (formObject.downline) {
        const ourValue = this.loggedInUserDetails.ourPercentage;
        const newOurValue = ourValue - this.registerForm.get('downline').value;
        this.registerForm.get('commLimit').clearValidators();
        this.registerForm.patchValue(
          { our: newOurValue },
          { emitEvent: false }
        );
        this.registerForm.get('commLimit').disable({ emitEvent: false });
        this.registerForm
          .get('commLimit')
          .updateValueAndValidity({ emitEvent: false });
      }
      if (!formObject.commLimit) {
        this.registerForm
          .get('downline')
          .setValidators([
            Validators.required,
            Validators.max(this.loggedInUserDetails?.ourPercentage - 1),
          ]);
        this.registerForm.get('downline').enable({ emitEvent: false });
        this.registerForm
          .get('downline')
          .updateValueAndValidity({ emitEvent: false });
      }
      if (!formObject.downline) {
        this.registerForm.patchValue(
          { our: this.loggedInUserDetails.ourPercentage },
          { emitEvent: false }
        );
        if (this.registerForm.get('commLimit')) {
          this.registerForm.get('commLimit').setValidators(Validators.required);
          this.registerForm.get('commLimit').enable({ emitEvent: false });
          this.registerForm
            .get('commLimit')
            .updateValueAndValidity({ emitEvent: false });
        }
      }
      // set validator for min-max
      if (formObject.exposerLimit) {
        this.registerForm
          .get('exposerLimit')
          .setValidators([
            Validators.required,
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
            Validators.max(formObject.creditReference * 2),
          ]);
      }
      if (formObject.accountType === 'User') {
        this.handleFieldsForUser();
      } else if (formObject.accountType !== 'User') {
        this.handleFieldsForOtherAccountTypes();
      }
    });
  }

  initRegisterForm() {
    this.registerForm = new FormGroup({
      userName: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9]+([a-zA-Z0-9](_)[a-zA-Z0-9])*[a-zA-Z0-9]+$/
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      fullName: new FormControl(''),
      city: new FormControl(''),
      phoneNumber: new FormControl('', [
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      accountType: new FormControl('', Validators.required),
      creditReference: new FormControl('', [
        Validators.required,
        Validators.max(this.loggedInUserDetails?.availableBalance),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ]),
      exposerLimit: new FormControl('', Validators.required),
      commLimit: new FormControl('', [
        Validators.max(100),
        Validators.required,
      ]),
      upline: new FormControl(this.loggedInUserDetails?.uplinePercentage),
      downline: new FormControl('', [
        Validators.required,
        Validators.max(this.loggedInUserDetails?.ourPercentage - 1),
      ]),
      our: new FormControl(this.loggedInUserDetails?.ourPercentage),
    });
  }

  getAccountTypeArray() {
    const accountType = this.loggedInUserDetails.accountType;
    if (accountType === 'Admin') {
      this.accountTypes = this.accountTypes;
    } else if (accountType === 'SuperMaster') {
      this.accountTypes.forEach((account, index) => {
        if (account.displayValue === 'SuperMaster') {
          this.accountTypes.splice(index, 1);
        }
      });
    } else if (accountType === 'Master') {
      this.accountTypes = this.accountTypes.filter((account, index) => {
        if (
          account.displayValue !== 'SuperMaster' &&
          account.displayValue !== 'Master'
        ) {
          return account;
        }
      });
    } else if (accountType === 'Agent') {
      this.accountTypes = this.accountTypes.filter((account, index) => {
        if (
          account.displayValue !== 'SuperMaster' &&
          account.displayValue !== 'Master' &&
          account.displayValue !== 'Agent'
        ) {
          return account;
        }
      });
    }
  }

  onSelect(type) {}

  getErrorMessage(field: string) {
    if (this.registerForm.get(field).hasError('required')) {
      return 'Please enter value.';
    } else if (this.registerForm.get(field).hasError('pattern')) {
      if (field === 'password' || field === 'confirmPassword') {
        return 'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.';
      } else if (field === 'phoneNumber') {
        return 'Please enter valid contact number.';
      } else if (field === 'userName') {
        return 'Please enter valid username.';
      }
    } else if (this.registerForm.get(field).hasError('max')) {
      if (field === 'commLimit') {
        return 'Commision should be less than 100%';
      } else if (field === 'downline') {
        return 'Downline should be less than our percentage';
      } else if (field === 'creditReference') {
        return 'Credit Reference should be less than or equal available balance';
      } else if (field === 'exposerLimit') {
        return 'Exposer Limit should be less than double the amount of Credit Reference';
      }
    }
  }

  isPasswordAndConfirmPasswordSame() {
    const password = this.registerForm.get('password').value;
    const confirmPassword = this.registerForm.get('confirmPassword').value;
    return password === confirmPassword;
  }

  onAddAccoutClick(): void {
    const passCheckresult = this.isPasswordAndConfirmPasswordSame();
    if (!passCheckresult) {
      this.openSnackBar(
        'Password and confirm password should be same.',
        'error'
      );
      return null;
    }
    const dialogRef = this.dialog.open(MasterPasswordComponent, {
      data: {
        formValue: 'register',
        formValues: this.registerForm,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        const params = {
          city: this.registerForm.value.city,
          creditReferance: this.registerForm.value.creditReference,
          exposerLimit: this.registerForm.value.exposerLimit,
          fullName: this.registerForm.value.fullName,
          username: this.registerForm.value.userName,
          password: this.registerForm.value.password,
          contactNumber: this.registerForm.value.phoneNumber,
          commissionPecentage: this.registerForm.value.commLimit,
          uplinePercentage: this.registerForm.value.upline,
          downlinePecentage: this.registerForm.value.downline,
          ourPercentage: this.registerForm.value.our,
          accountType: this.registerForm.value.accountType,
          parentUserId: this.loggedInUserDetails.id,
          userStatus: true,
          bettingStatus: true,
        };
        this.loading$ = of(true);
        this.registerService.onRegister(params).subscribe(
          (res: any) => {
            if (res.success) {
              this.registerForm.reset();
              this.getUpdateUserDetails();
              this.registerFormDirective.resetForm();
              console.log('Account added successfully!', res);
              this.loading$ = of(false);
              this.openSnackBar('Account added successfully.', 'success');
              this.router.navigate(['/home/dashboard']);
              this.dialog.closeAll();
            } else if (res.error) {
              this.loading$ = of(false);
              this.openSnackBar(res.error, 'error');
            }
          },
          (error: any) => {
            this.loading$ = of(false);
            this.openSnackBar('Error occured while adding user', 'error');
            console.log('Error in adding user!', error);
          }
        );
      } else if (result == false) {
        this.loading$ = of(false);
        this.openSnackBar('Master Password is not correct', 'error');
      }
    });
  }

  openSnackBar(message: string, className: string) {
    const snackBarConfigObject = {
      duration: 3000,
      data: message,
      panelClass: className,
    };
    this.matSnackBar.openFromComponent(SnackbarComponent, snackBarConfigObject);
  }

  getUpdateUserDetails() {
    this.accountService.getLoggedInUserDetails().subscribe((res) => {
      this.accountService.loggedInUserDetails = res['user'];
    });
  }

  handleFieldsForUser() {
    this.isSelectedAccountTypeUser = true;
    this.handleValidatorsForUserDependentFields();
  }

  handleFieldsForOtherAccountTypes() {
    this.isSelectedAccountTypeUser = false;
    this.handleValidatorsForOtherAccountTypeFields();
  }

  handleValidatorsForUserDependentFields() {
    // if (this.registerForm.get('commLimit'))
    this.registerForm.patchValue({ commLimit: '' }, { emitEvent: false });
    this.registerForm.get('commLimit').clearValidators();
    this.registerForm
      .get('commLimit')
      .updateValueAndValidity({ emitEvent: false });
    this.registerForm.get('upline').clearValidators();
    this.registerForm
      .get('upline')
      .updateValueAndValidity({ emitEvent: false });
    this.registerForm.patchValue({ downline: '' }, { emitEvent: false });
    this.registerForm.get('downline').clearValidators();
    this.registerForm
      .get('downline')
      .updateValueAndValidity({ emitEvent: false });
    this.registerForm.get('our').clearValidators();
    this.registerForm.get('our').updateValueAndValidity({ emitEvent: false });
    this.registerForm
      .get('creditReference')
      .setValidators([
        Validators.required,
        Validators.max(this.loggedInUserDetails?.availableBalance),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ]);
    this.registerForm
      .get('exposerLimit')
      .setValidators([
        Validators.required,
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        Validators.max(this.registerForm.get('creditReference').value * 2),
      ]);
  }

  handleValidatorsForOtherAccountTypeFields() {
    // this.registerForm.get('creditReference').clearValidators();
    // this.registerForm
    //   .get('creditReference')
    //   .updateValueAndValidity({ emitEvent: false });
    this.registerForm.patchValue({ exposerLimit: '' }, { emitEvent: false });
    this.registerForm.get('exposerLimit').clearValidators();
    this.registerForm
      .get('exposerLimit')
      .updateValueAndValidity({ emitEvent: false });

    this.registerForm
      .get('downline')
      .setValidators([
        Validators.required,
        Validators.max(this.loggedInUserDetails?.ourPercentage - 1),
      ]);
    this.registerForm
      .get('downline')
      .updateValueAndValidity({ emitEvent: false });

    this.registerForm
      .get('commLimit')
      .setValidators([Validators.required, Validators.max(100)]);
    this.registerForm
      .get('commLimit')
      .updateValueAndValidity({ emitEvent: false });
  }
}
