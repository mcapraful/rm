import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActionsServiceService } from '../../services/actions-service.service';
import { AccountsService } from '../../services/accounts-service';
import { PageModel } from '../../shared/page-model';
import { ActionModalComponent } from '../action-modal/action-modal.component';
import { MasterPasswordComponent } from '../master-password/master-password.component';
import { accountTableMapping } from './account-list-table-mapping';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
})
export class AccountListComponent implements OnInit {
  loggedInUser;
  tableColumns: any;
  tableRows = [];
  page = new PageModel();
  totalRecords: number;
  loading$: Observable<boolean>;
  searchTextboxControl: FormControl = new FormControl();

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountsService,
    private readonly dialog: MatDialog,
    private readonly actionServive: ActionsServiceService,
    private readonly matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getLoggedInUserInfo();
    this.loading$ = of(false);
    this.setTableColumns();
    this.searchTextboxControl.valueChanges
      .pipe(debounceTime(1200))
      .pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.getTableRows({
          searchKey: data,
        });
      });
  }

  getLoggedInUserInfo() {
    this.accountService.getLoggedInUserDetails().subscribe((res) => {
      if (res['success']) {
        this.loggedInUser = this.accountService.loggedInUserDetails =
          res['user'];
        this.getTableRows();
      } else if (res['error']) {
        console.log('Error occured while fetching user details', res);
      }
    });
  }

  setTableColumns() {
    this.tableColumns = accountTableMapping;
  }

  onAddAccoutClick() {
    this.router.navigate(['/home/register']);
  }

  onRowClicked($event) {
    if ($event) {
      if ($event.column.prop === 'username') {
        this.router.navigate(['/home/accountInfo'], {
          queryParams: {
            u_name: $event.row.username.displayValue,
            id: $event.row.id,
          },
        });
      }
    }
  }

  getTableRows(data?: any) {
    let params: {} = {};
    let tableRows;
    this.loading$ = of(true);
    if (data?.searchKey) {
      params = {
        searchKey: data?.searchKey,
        parentuserid: this.loggedInUser.id,
      };
    } else {
      params = {
        pageIndex: this.page?.pageNumber ? this.page.pageNumber : 0,
        pageSize: this.page?.size ? this.page.size : 10,
        parentuserid: this.loggedInUser.id,
      };
    }
    this.accountService.getAccountList(params).subscribe((res) => {
      this.tableRows = [];
      this.totalRecords = res['totalrecordsCount'];
      tableRows = res['users'];
      tableRows.forEach((row) => {
        const obj = {
          accountType: '',
          availableBalance: '',
          balance: '',
          commission: '',
          client: '',
          creditReferance: '',
          default: '',
          delete: '',
          exposure: '',
          exposureLimit: '',
          srNo: '',
          id: '',
          username: {},
          bst: {},
          ust: {},
        };
        obj.accountType = row.accountType;
        obj.availableBalance = `${row.availableBalance}`;
        obj.balance = `${row.exposer + row.availableBalance}`;
        obj.commission =
          row.accountType === 'User' ? 'N.A.' : `${row.commissionPecentage}`;
        obj.client = `${row.profitLoss}`;
        obj.username = row.username;
        obj.creditReferance = `${row.creditReferance}`;
        obj.default =
          row.accountType === 'User' ? 'N.A.' : `${row.ourPercentage}`;
        obj.delete = row.delete;
        obj.exposure = row.accountType === 'User' ? `${row.exposer}` : 'N.A.';
        obj.exposureLimit =
          row.accountType === 'User' ? `${row.exposerLimit}` : 'N.A.';
        obj.srNo = row.srNo;
        obj.id = row.id;
        obj.ust = row.userStatus.toString();
        obj.bst = row.bettingStatus.toString();
        obj.username = {
          displayValue: row.username,
          type: 'button',
        };
        if (this.loggedInUser.accountType === 'Admin') {
          this.tableRows = this.tableRows.filter((row) => {
            if (row.id != this.loggedInUser.id) {
              return row;
            }
          });
        }
        this.tableRows = [...this.tableRows, obj];
      });
      this.accountService.currentPageAccountsList = this.tableRows;
      this.loading$ = of(false);
    });
  }

  handleActionClick(event) {
    if (event.action === 'deposit') {
      event.modalHeader = 'Deposit';
    } else if (event.action === 'withdraw') {
      event.modalHeader = 'Withdraw';
    } else if (event.action === 'credit') {
      event.modalHeader = 'Credit';
    } else if (event.action === 'limit') {
      event.modalHeader = 'Exposure Limit';
    } else if (event.action === 'password') {
      event.modalHeader = 'Password';
    } else if (event.action === 'status') {
      event.modalHeader = 'Change status';
    }
    this.openDialog(event);
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(ActionModalComponent, {
      data: event,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((actionModalResult) => {
      console.log(actionModalResult);
      if (actionModalResult) {
        this.openMasterPasswordPopUp(actionModalResult.data);
      }
      console.log('The dialog was closed');
    });
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
        this.openDialog(event);
      },
      (err) => {
        this.loading$ = of(false);
        console.log('Error occured in getting Balance from API', err);
      }
    );
  }

  openMasterPasswordPopUp(actionModalResult) {
    const dialogRef = this.dialog.open(MasterPasswordComponent, {
      data: {},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (actionModalResult.action === 'deposit') {
          const payload = {
            userId: actionModalResult.rowData.id,
            amount: +actionModalResult.formData.amount,
            remark: actionModalResult.formData.remark,
            parentuserid: this.loggedInUser.id,
          };
          this.loading$ = of(true);
          this.actionServive.onDeposit(payload).subscribe(
            (res: any) => {
              if (res.success) {
                this.loading$ = of(false);
                this.getUpdateUserDetails();
                this.openSnackBar('Amount deposited succesfully', 'success');
                this.dialog.closeAll();
                this.getTableRows();
              } else if (res.error) {
                this.loading$ = of(false);
                this.openSnackBar(res.error, 'error');
                this.dialog.closeAll();
                console.log(res);
              }
            },
            (error: any) => {
              this.loading$ = of(false);
              this.openSnackBar(
                'Error occured while depositing money',
                'error'
              );
              console.log('Error in Depositing money::', error);
            }
          );
        } else if (actionModalResult.action === 'withdraw') {
          const payload = {
            userId: actionModalResult.rowData.id,
            amount: +actionModalResult.formData.withdrawAmount,
            remark: actionModalResult.formData.withdrawRemark,
            parentuserid: this.loggedInUser.id,
          };
          this.loading$ = of(true);
          this.actionServive.onWithdraw(payload).subscribe(
            (res: any) => {
              if (res.success) {
                this.loading$ = of(false);
                this.getUpdateUserDetails();
                this.openSnackBar('Amount Withdrawn succesfully', 'success');
                this.dialog.closeAll();
                this.getTableRows();
              } else if (res.error) {
                this.loading$ = of(false);
                this.openSnackBar(res.error, 'error');
                this.dialog.closeAll();
                console.log(res);
              }
            },
            (error: any) => {
              this.loading$ = of(false);
              this.openSnackBar(
                'Error occured while Withdrawing money',
                'error'
              );
              console.log('Error in Withdrawn money::', error);
            }
          );
        } else if (actionModalResult.action === 'limit') {
          const params = new HttpParams()
            .set('userId', actionModalResult.rowData.id)
            .set('oldLimit', actionModalResult.formData.oldLimt)
            .set('newLimit', actionModalResult.formData.newLimt);

          this.loading$ = of(true);
          this.actionServive.onChangeLimit(params).subscribe(
            (res: any) => {
              if (res.success) {
                this.loading$ = of(false);
                this.dialog.closeAll();
                this.getUpdateUserDetails();
                this.getTableRows();
                this.openSnackBar(
                  'Exposure limit updated successfully',
                  'success'
                );
              } else if (res.error) {
                this.loading$ = of(false);
                this.dialog.closeAll();
                console.log(res);
                this.openSnackBar('Exposure limit update failed', 'error');
              }
            },
            (error: any) => {
              this.loading$ = of(false);
              console.log('Error in login::', error);
              this.openSnackBar('Exposure limit update failed', 'error');
            }
          );
        } else if (actionModalResult.action === 'password') {
          const payload = {
            userId: actionModalResult.rowData.id,
            newPassword: actionModalResult.formData.newPass,
          };

          this.loading$ = of(true);
          this.actionServive.onChangePassword(payload).subscribe(
            (res: any) => {
              if (res.success) {
                this.loading$ = of(false);
                this.getUpdateUserDetails();
                this.openSnackBar(
                  'User password updated successfully',
                  'success'
                );
                this.dialog.closeAll();
              } else if (res.error) {
                this.loading$ = of(false);
                this.openSnackBar(
                  'Error occured while updating password',
                  'error'
                );
                this.dialog.closeAll();
                console.log(res);
              }
            },
            (error: any) => {
              this.loading$ = of(false);
              this.openSnackBar(
                'Error occured while updating password',
                'error'
              );
              console.log('Error in login::', error);
            }
          );
        } else if (actionModalResult.action === 'status') {
          if (actionModalResult.formData.userActive == '') {
            actionModalResult.formData.userActive = false;
          }
          if (actionModalResult.formData.betActive == '') {
            actionModalResult.formData.betActive = false;
          }
          const params = new HttpParams()

            .set('userId', actionModalResult.rowData.id)
            .set('userStatus', actionModalResult.formData.userActive)
            .set('betStatus', actionModalResult.formData.betActive);

          this.loading$ = of(true);
          this.actionServive.onChangeStatus(params).subscribe(
            (res: any) => {
              if (res.success) {
                this.loading$ = of(false);
                this.getUpdateUserDetails();
                this.openSnackBar(
                  'User status updated successfully',
                  'success'
                );
                this.dialog.closeAll();
                this.getTableRows();
              } else if (res.error) {
                this.loading$ = of(false);
                this.openSnackBar(
                  'Error occured while updating status.',
                  'error'
                );
                this.dialog.closeAll();
                console.log(res);
              }
            },
            (error: any) => {
              this.loading$ = of(false);
              this.openSnackBar(
                'Error occured while updating status.',
                'error'
              );
              console.log('Error in login::', error);
            }
          );
        }
      } else if (result === false) {
        this.openSnackBar('Master Password is incorrect', 'error');
      }
    });
  }

  pageEventChange(eventObj) {
    this.page = {
      size: eventObj.limit,
      totalElements: eventObj.count,
      totalPages: Math.ceil(eventObj.count / eventObj.limit),
      pageNumber: eventObj.offset,
    };
    this.getTableRows();
  }

  getUpdateUserDetails() {
    this.accountService.getLoggedInUserDetails().subscribe((res) => {
      this.loggedInUser = this.accountService.loggedInUserDetails = res['user'];
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

  onDownloadPdf(ClientDetails) {
    const actionName = 'pdf';
    window.open('download?action=' + encodeURI(actionName) + '&id=' + encodeURI(ClientDetails));
  }

  onDownLoadExcel(ClientDetails) {
    const actionName = 'excel';
    window.open('download?action=' + encodeURI(actionName) + '&id=' + encodeURI(ClientDetails));
  }
}
