import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AccountsService } from '../../services/accounts-service';
import { clientTableMapping } from './client-table-mapping';
import { ActionModalComponent } from '../action-modal/action-modal.component';
import { PageModel } from 'src/app/shared/page-model';
import { Observable, of } from 'rxjs';
import { MasterPasswordComponent } from '../master-password/master-password.component';
import { HttpParams } from '@angular/common/http';
import { ActionsServiceService } from 'src/app/services/actions-service.service';
@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrls: ['./view-account.component.css'],
})
export class ViewAccountComponent implements OnInit {
  u_name: string;
  currentId: number;
  accountedData;
  tableColumns = clientTableMapping;
  tableRows = [];
  totalRecords: number;
  page = new PageModel();
  loading$: Observable<boolean>;
  parentChildHeirarchy = '';
  clientHeirarchy = {
    'Sub master': ['Master', 'Agent', 'Client'],
    Master: ['Agent', 'Client'],
    Agent: ['Client'],
  };

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private accountService: AccountsService,
    public readonly dialog: MatDialog,
    private readonly actionServive: ActionsServiceService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.u_name = params['u_name'];
      this.currentId = +params['id'];
    });
    this.parentChildHeirarchy = `${this.u_name}`;
    this.getTableRows(null);
  }

  getTableRows(clickedUserID) {
    let tableRows;
    this.loading$ = of(true);
    const params = {
      pageIndex: this.page?.pageNumber ? this.page.pageNumber : 0,
      pageSize: this.page?.size ? this.page.size : 10,
      parentuserid: clickedUserID ? clickedUserID : this.currentId,
    };
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
          creditReference: '',
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
        obj.creditReference = `${row.creditReferance}`;
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
        this.tableRows = [...this.tableRows, obj];
      });
      this.accountService.currentPageAccountsList = this.tableRows;
      this.loading$ = of(false);
    });
  }

  onRowClicked($event) {
    if ($event) {
      if ($event.column.prop === 'username') {
        if ($event.row.accountType !== 'User') {
          this.parentChildHeirarchy = `${this.parentChildHeirarchy} > ${$event.row.username.displayValue}`;
          this.getTableRows($event.row.id);
        }
      }
    }
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
    });

    dialogRef.afterClosed().subscribe((actionModalResult) => {
      console.log(actionModalResult);
      if (actionModalResult) {
        this.openMasterPasswordPopUp(actionModalResult.data);
      }
      console.log('The dialog was closed');
    });
  }

  openMasterPasswordPopUp(actionModalResult) {
    const dialogRef = this.dialog.open(MasterPasswordComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (actionModalResult.action === 'deposit') {
        const params = new HttpParams()
          .set('userId', actionModalResult.rowData.id)
          .set('amount', actionModalResult.formData.amount)
          .set('remark', actionModalResult.formData.remark);

        this.actionServive.onDeposit(params).subscribe(
          (res: any) => {
            if (res.success) {
              this.router.navigate(['/home/dashboard']);
              this.dialog.closeAll();
              this.getTableRows(null);
            } else {
              this.dialog.closeAll();
              console.log(res);
            }
          },
          (error: any) => {
            console.log('Error in login::', error);
          }
        );
      } else if (actionModalResult.action === 'withdraw') {
        const params = new HttpParams()
          .set('userId', actionModalResult.rowData.id)
          .set('amount', actionModalResult.formData.withdrawAmount)
          .set('remark', actionModalResult.formData.withdrawRemark);

        this.actionServive.onWithdraw(params).subscribe(
          (res: any) => {
            if (res.success) {
              this.router.navigate(['/home/dashboard']);
              this.dialog.closeAll();
              this.getTableRows(null);
            } else {
              this.dialog.closeAll();
              console.log(res);
            }
          },
          (error: any) => {
            console.log('Error in login::', error);
          }
        );
      } else if (actionModalResult.action === 'credit') {
        const params = new HttpParams()
          .set('userId', actionModalResult.rowData.id)
          .set('oldLimit', actionModalResult.formData.oldCreditLimt)
          .set('newLimit', actionModalResult.formData.newCreditLimt);

        this.actionServive.onChangeCreditLimit(params).subscribe(
          (res: any) => {
            if (res.success) {
              this.router.navigate(['/home/dashboard']);
              this.dialog.closeAll();
              this.getTableRows(null);
            } else {
              this.dialog.closeAll();
              console.log(res);
            }
          },
          (error: any) => {
            console.log('Error in login::', error);
          }
        );
      } else if (actionModalResult.action === 'limit') {
        const params = new HttpParams()
          .set('userId', actionModalResult.rowData.id)
          .set('oldLimit', actionModalResult.formData.oldLimt)
          .set('newLimit', actionModalResult.formData.newLimt);

        this.actionServive.onChangeLimit(params).subscribe(
          (res: any) => {
            if (res.success) {
              this.router.navigate(['/home/dashboard']);
              this.dialog.closeAll();
              this.getTableRows(null);
            } else {
              this.dialog.closeAll();
              console.log(res);
            }
          },
          (error: any) => {
            console.log('Error in login::', error);
          }
        );
      } else if (actionModalResult.action === 'password') {
        const params = new HttpParams()

          .set('userId', actionModalResult.rowData.id)
          .set('currentPassword', actionModalResult.formData.oldPass)
          .set('newPassword', actionModalResult.formData.newPass);

        this.actionServive.onChangePassword(params).subscribe(
          (res: any) => {
            if (res.success) {
              this.router.navigate(['/home/dashboard']);
              this.dialog.closeAll();
              this.getTableRows(null);
            } else {
              this.dialog.closeAll();
              console.log(res);
            }
          },
          (error: any) => {
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

        this.actionServive.onChangeStatus(params).subscribe(
          (res: any) => {
            if (res.success) {
              this.router.navigate(['/home/dashboard']);
              this.dialog.closeAll();
              this.getTableRows(null);
            } else {
              this.dialog.closeAll();
              console.log(res);
            }
          },
          (error: any) => {
            console.log('Error in login::', error);
          }
        );
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
    this.getTableRows(null);
  }
}
