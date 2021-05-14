import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActionModalComponent } from '../action-modal/action-modal.component';
import { AccountsService } from 'src/app/services/accounts-service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MasterPasswordComponent } from '../master-password/master-password.component';
import { Observable, of } from 'rxjs';
import { ActionsServiceService } from 'src/app/services/actions-service.service';
import { UtilService } from '../../services/util-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loggedInUserInfo: any;
  accountType = '';
  bussinessInfoMap;
  balanceObj;
  matkaBussinessArray = [];
  window = window as any;
  loading$: Observable<boolean>;

  @Output() menuClicked = new EventEmitter();

  constructor(
    private readonly router: Router,
    public readonly dialog: MatDialog,
    private readonly accountService: AccountsService,
    private readonly userService: UserService,
    private matSnackBar: MatSnackBar,
    private readonly actionServive: ActionsServiceService
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.getMatkaBussinessList();
    this.userService.bussinessInfoMap$.subscribe((bussinessInfoMap) => {
      this.bussinessInfoMap = bussinessInfoMap;
      console.log(bussinessInfoMap);
    });
  }

  getUserDetails() {
    if (this.accountService.loggedInUserDetails) {
      this.loggedInUserInfo = this.accountService.loggedInUserDetails;
      this.accountType = this.loggedInUserInfo.accountType;
    } else {
      this.accountService.getLoggedInUserDetails().subscribe(
        (res) => {
          if (res['success']) {
            this.loggedInUserInfo = this.accountService.loggedInUserDetails =
              res['user'];
            console.log(this.loggedInUserInfo);
            this.accountType = this.loggedInUserInfo.accountType;
            this.balanceObj = {
              availableBalance: this.loggedInUserInfo.availableBalance,
              exposer: this.loggedInUserInfo.exposer,
            };
          } else if (res['error']) {
            console.log('Error occured while fetching user details', res);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onHomeClick() {
    if (this.loggedInUserInfo.accountType === 'User') {
      this.router.navigate(['/home/user/user-dashboard']);
    } else {
      this.router.navigate(['/home/dashboard']);
    }
  }

  getMatkaBussinessList() {
    if (this.accountService.matkaBussinessObj) {
      this.matkaBussinessArray = this.accountService.matkaBussinessObj;
    } else {
      this.accountService.getMatkaBussinessList().subscribe((res) => {
        const bussinessListArray = res['BusinessList'];
        bussinessListArray.forEach((bussiness) => {
          bussiness.openTime = bussiness.openTime
            ? UtilService.convertTimeToAmPm(bussiness.openTime)
            : null;
          bussiness.closeTime = bussiness.closeTime
            ? UtilService.convertTimeToAmPm(bussiness.closeTime)
            : null;
          const obj = {
            bussinessName: '',
            bussinessId: 0,
            openTime: '',
            closeTime: '',
          };
          obj.bussinessId = bussiness.id;
          obj.bussinessName = bussiness.name;
          obj.openTime = bussiness.openTime;
          obj.closeTime = bussiness.closeTime;
          this.matkaBussinessArray.push(obj);
          this.accountService.matkaBussinessObj = [...this.matkaBussinessArray];
        });
      });
    }
  }

  onLogout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('accountType');
    this.router.navigate(['/login']);
  }

  onMenuClick() {
    this.menuClicked.emit();
  }

  onResultClick(): void {
    if (this.accountType == 'Admin') {
      const dialogRef = this.dialog.open(ActionModalComponent, {
        data: {
          action: 'submitResult',
          modalHeader: 'Submit Todays Result',
          userData: this.loggedInUserInfo,
          businessType: this.matkaBussinessArray,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.openMasterPasswordPopUp(result.data);
        }
      });
    } else {
      this.router.navigate(['/home/results']);
    }
  }

  submitResult(modalResponse: any) {
    const result = modalResponse;
    const payload = {
      businessId: +result?.rowData?.bussinessId,
      result: result?.formData?.result,
      showType: result?.formData?.showType,
    };
    this.loading$ = of(true);
    this.accountService.addMatkaResult(payload).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading$ = of(false);
          this.openSnackBar('Result Submitted successfully.', 'success');
          console.log('Result Submitted Successfully!!', res);
        } else if (res.error) {
          this.loading$ = of(false);
          this.openSnackBar(res.error, 'error');
          console.log('Error occured while submitting result', res.error);
        }
      },
      (err) => {
        this.loading$ = of(false);
        this.openSnackBar('Error occured while submitting result', 'error');
        console.log('Error occured!!', err);
      }
    );
  }

  onChangePasswordClick(): void {
    const dialogRef = this.dialog.open(ActionModalComponent, {
      data: {
        action: 'password',
        modalHeader: 'Change Password',
        userData: this.loggedInUserInfo,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openMasterPasswordPopUp(result.data);
      }
      console.log('The dialog was closed from header', result);
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

  navigateToBusiness(businessName) {

    if (businessName === 'Home') {
      return;
    }

    this.router.navigate(['/home/user/bid-type'], {
      queryParams: {
        bName: businessName,
      },
    });
  }

  navigateToAdminActions(action) {
    if (action === 'submitResult') {
      this.onResultClick();
    } else {
      this.router.navigate([action]);
    }
  }


  openMasterPasswordPopUp(actionModalResult) {
    const dialogRef = this.dialog.open(MasterPasswordComponent, {
      data: {},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (actionModalResult.action === 'submitResult') {
          this.submitResult(actionModalResult);
        } else if (actionModalResult.action === 'password') {
          this.changePassword(actionModalResult);
        }
      } else if (result === false) {
        this.openSnackBar('Master Password is incorrect', 'error');
      }
    });
  }

  changePassword(actionModalResult) {
    const payload = {
      userId: actionModalResult.rowData.id,
      newPassword: actionModalResult.formData.newPass,
    };

    this.loading$ = of(true);
    this.actionServive.onChangePassword(payload).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading$ = of(false);
          this.openSnackBar('Password updated successfully', 'success');
          this.dialog.closeAll();
        } else if (res.error) {
          this.loading$ = of(false);
          this.openSnackBar('Error occured while updating password', 'error');
          this.dialog.closeAll();
          console.log(res);
        }
      },
      (error: any) => {
        this.loading$ = of(false);
        this.openSnackBar('Error occured while updating password', 'error');
        console.log('Error in login::', error);
      }
    );
  }

  showCreditBalance() {
    this.loading$ = of(true);
    this.accountService.getLoggedInUserDetails().subscribe(
      (res) => {
        const userInfo = res['user'];
        const event = {
          action: 'showBalance',
          modalHeader: 'Account Summary',
          popupData: {
            accountType: userInfo['accountType'],
            availableBalance: userInfo['availableBalance'],
            creditReferance: userInfo['creditReferance'],
            masterBalance: userInfo['masterBalance'],
            userStatus: userInfo['userStatus'],
            bettingStatus: userInfo['bettingStatus'],
            default: userInfo['ourPercentage'],
            exposerLimit: userInfo['exposerLimit'],
            profitLoss: userInfo['profitLoss'],
            exposer: userInfo['exposer'],
            upperlevel: userInfo['upperlevel'],
          },
        };
        this.loading$ = of(false);
        this.openAccountSummary(event);
      },
      (err) => {
        this.loading$ = of(false);
        console.log('Error occured in getting Balance from API', err);
      }
    );
  }

  openAccountSummary(event) {
    const dialogRef = this.dialog.open(ActionModalComponent, {
      data: event,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed from header', result);
    });
  }

  onAccountStatementClick() {
    this.router.navigate(['/home/account-statement']);
  }

  onMyBetClick() {
    this.router.navigate(['/home/my-bet']);
  }
  onGenaralReportClick() {
    this.router.navigate(['/home/general-report']);
  }

  onCurrentBetClick() {
    this.router.navigate(['/home/current-bet']);
  }

  onProfitLossClick() {
    this.router.navigate(['/home/profit-loss']);
  }

  onBookShowClick() {
    this.router.navigate(['/home/market-analysis']);
  }
}
