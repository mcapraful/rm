import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterPasswordComponent } from '../master-password/master-password.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ActionsServiceService } from '../../services/actions-service.service';
import { Router } from '@angular/router';
import { AccountsService } from 'src/app/services/accounts-service';

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.css'],
})
export class ActionModalComponent implements OnInit {
  loggedInUserInfo;
  currentUserName: '';
  selected;
  showPassword = false;
  showConfirmPassword = false;
  actionForm: FormGroup;
  creditActionForm: FormGroup;
  limitActionForm: FormGroup;
  passwordActionForm: FormGroup;
  depositActionForm: FormGroup;
  withdrawActionForm: FormGroup;
  statusActionForm: FormGroup;
  submitResultForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ActionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public readonly dialog: MatDialog,
    private readonly actionServive: ActionsServiceService,
    private readonly accountService: AccountsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.selected = 0;
    this.setCurrentAndLoggedInUser();
    this.initCreditActionForm();
    this.initLimitActionForm();
    this.initPasswordActionForm();
    this.initDepositActionForm();
    this.initWithdrawActionForm();
    this.initStatusActionForm();
    this.initSubmitResultForm();
    this.submitResultForm.valueChanges.subscribe((formObject) => {
      if (formObject.showType === 'Open') {
        this.submitResultForm.get('result').clearValidators();
        this.submitResultForm
          .get('result')
          .setValidators([
            Validators.required,
            Validators.pattern('^\\d{3}-\\d{1}$'),
          ]);
        this.submitResultForm
          .get('result')
          .updateValueAndValidity({ emitEvent: false });
      } else if (formObject.showType === 'Close') {
        this.submitResultForm.get('result').clearValidators();
        this.submitResultForm
          .get('result')
          .setValidators([
            Validators.required,
            Validators.pattern(`^\\d{1}-\\d{3}$`),
          ]);
        this.submitResultForm
          .get('result')
          .updateValueAndValidity({ emitEvent: false });
      }
    });
    this.depositActionForm.valueChanges.subscribe((formObject) => {
      if (formObject.amount) {
        const newAvailabelBalance =
          this.loggedInUserInfo.availableBalance -
          this.depositActionForm.get('amount').value;
        this.depositActionForm.patchValue(
          {
            loggedInUserBalance: newAvailabelBalance,
          },
          { emitEvent: false }
        );
      }
      if (formObject.amount === '') {
        this.depositActionForm.patchValue(
          {
            loggedInUserBalance: this.loggedInUserInfo.availableBalance,
          },
          { emitEvent: false }
        );
      }
    });
    this.withdrawActionForm.valueChanges.subscribe((formObject) => {
      if (formObject.withdrawAmount) {
        const newAvailabelBalance =
          this.data.userData?.availableBalance -
          this.withdrawActionForm.get('withdrawAmount').value;
        this.withdrawActionForm.patchValue(
          {
            currentUserBalance: newAvailabelBalance,
          },
          { emitEvent: false }
        );
      }
      if (formObject.withdrawAmount === '') {
        this.withdrawActionForm.patchValue(
          {
            currentUserBalance: this.data.userData?.availableBalance,
          },
          { emitEvent: false }
        );
      }
    });
  }

  setCurrentAndLoggedInUser() {
    this.currentUserName = this.data.userData?.username.displayValue;
    this.loggedInUserInfo = this.accountService.loggedInUserDetails;
  }

  initCreditActionForm() {
    this.creditActionForm = new FormGroup({
      oldCreditLimt: new FormControl('', Validators.required),
      newCreditLimt: new FormControl('', Validators.required),
    });
  }

  initLimitActionForm() {
    this.limitActionForm = new FormGroup({
      oldLimt: new FormControl(
        this.data.userData?.exposureLimit,
        Validators.required
      ),
      newLimt: new FormControl('', Validators.required),
    });
  }
  initPasswordActionForm() {
    this.passwordActionForm = new FormGroup({
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

  initDepositActionForm() {
    this.depositActionForm = new FormGroup({
      loggedInUserBalance: new FormControl(
        this.loggedInUserInfo.availableBalance,
        Validators.required
      ),
      currentUserBalance: new FormControl(
        this.data.userData?.availableBalance,
        Validators.required
      ),
      amount: new FormControl('', [
        Validators.required,
        Validators.max(this.loggedInUserInfo.availableBalance),
      ]),
      remark: new FormControl('', Validators.required),
    });
  }

  initWithdrawActionForm() {
    this.withdrawActionForm = new FormGroup({
      parentUserBalance: new FormControl(
        this.loggedInUserInfo.availableBalance,
        Validators.required
      ),
      currentUserBalance: new FormControl(
        this.data.userData?.availableBalance,
        Validators.required
      ),
      withdrawAmount: new FormControl('', [
        Validators.required,
        Validators.max(this.data.userData?.availableBalance),
      ]),
      withdrawRemark: new FormControl('', Validators.required),
    });
  }

  initStatusActionForm() {
    const userStatus = this.data.userData?.ust === 'true' ? true : false;
    const betStatus = this.data.userData?.bst === 'true' ? true : false;
    this.statusActionForm = new FormGroup({
      userActive: new FormControl(userStatus, Validators.required),
      betActive: new FormControl(betStatus, Validators.required),
    });
  }

  initSubmitResultForm() {
    this.submitResultForm = new FormGroup({
      bussinessType: new FormControl('', Validators.required),
      showType: new FormControl('', Validators.required),
      result: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.data.action === 'credit') {
      this.dialogRef.close({
        data: {
          formData: this.creditActionForm.value,
          action: this.data.action,
          rowData: this.data.userData,
        },
      });
    }
    if (this.data.action === 'limit') {
      this.dialogRef.close({
        data: {
          formData: this.limitActionForm.value,
          action: this.data.action,
          rowData: this.data.userData,
        },
      });
    }
    if (this.data.action === 'password') {
      this.dialogRef.close({
        data: {
          formData: this.passwordActionForm.value,
          action: this.data.action,
          rowData: this.data.userData,
        },
      });
    }
    if (this.data.action === 'deposit') {
      this.dialogRef.close({
        data: {
          formData: this.depositActionForm.value,
          action: this.data.action,
          rowData: this.data.userData,
        },
      });
    }
    if (this.data.action === 'withdraw') {
      this.dialogRef.close({
        data: {
          formData: this.withdrawActionForm.value,
          action: this.data.action,
          rowData: this.data.userData,
        },
      });
    }
    if (this.data.action === 'status') {
      this.dialogRef.close({
        data: {
          formData: this.statusActionForm.value,
          action: this.data.action,
          rowData: this.data.userData,
        },
      });
    }
    if (this.data.action === 'submitResult') {
      this.dialogRef.close({
        data: {
          formData: this.submitResultForm.value,
          action: this.data.action,
          rowData: this.data.businessType[this.selected],
        },
      });
    }
  }

  onValueChange(buss) {
    console.log(buss);
  }

  getErrorMessage(field: string) {
    if (this.submitResultForm?.get(field)?.hasError('required')) {
      return 'Please enter value.';
    } else if (this.submitResultForm?.get(field)?.hasError('pattern')) {
      return 'Please enter valid result.';
    } else if (this.depositActionForm?.get(field)?.hasError('max')) {
      return `Amount should be less than ${this.loggedInUserInfo.username} Balance.`;
    } else if (this.withdrawActionForm?.get(field)?.hasError('max')) {
      return `Withdraw amount should be less than ${this.currentUserName} Balance.`;
    } else if (this.passwordActionForm?.get(field)?.hasError('pattern')) {
      return 'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.';
    }
  }

  events: string[] = [
    'Time Bazar',
    'Milan Day',
    'Kalyan',
    'Milan Night',
    'Main Ratan',
    'Star Day',
    'Star Night',
  ];
}
