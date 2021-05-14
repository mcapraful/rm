import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { currentBetsTableMapping } from './currentbets-report-table-mapping';
import { currentBetsTableRows } from './current-bets-table-data';
import { DatePipe } from '@angular/common';
import { AccountsService } from 'src/app/services/accounts-service';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageModel } from 'src/app/shared/page-model';
import { MatDialog } from '@angular/material/dialog';
import { ActionModalComponent } from '../action-modal/action-modal.component';

@Component({
  selector: 'app-current-bets',
  templateUrl: './current-bets.component.html',
  styleUrls: ['./current-bets.component.css'],
})
export class CurrentBetsComponent implements OnInit {
  tableColumns = [];
  tableRows = [];
  filteredData = [];
  currentBetsForm: FormGroup;
  totalRecords;
  datePipe: DatePipe = new DatePipe('en');
  loading$: Observable<boolean>;
  page = new PageModel();
  @ViewChild('formGroupDirective', { static: false }) statementForm;

  constructor(
    private readonly accountService: AccountsService,
    private readonly matSnackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {}
  todayDate = moment(new Date()).format('MM/DD/YYYY');

  ngOnInit(): void {
    this.initGeneralReportForm();
    this.getTableColumns();
    this.getCurrentBets();
    // this.getBids({ fromDate: this.todayDate, toDate: this.todayDate });
  }

  initGeneralReportForm() {
    this.currentBetsForm = new FormGroup({
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl('', Validators.required),
    });
  }

  getTableColumns() {
    this.tableColumns = currentBetsTableMapping;
  }

  onLoadRecordsClick() {
    const params = {
      fromDate: this.datePipe.transform(
        this.currentBetsForm.get('fromDate').value,
        'MM/dd/yyyy'
      ),
      toDate: this.datePipe.transform(
        this.currentBetsForm.get('toDate').value,
        'MM/dd/yyyy'
      ),
      pageIndex: this.page?.pageNumber ? this.page.pageNumber : 0,
      pageSize: this.page?.size ? this.page.size : 10,
    };
    this.getBids(params);
  }

  getCurrentBets() {
    this.loading$ = of(true);
    this.accountService.getCurrentBets().subscribe(
      (res: any) => {
        if (res.success) {
          this.tableRows = [];
          // this.statementForm.resetForm();
          const transations = res['bettings'];
          this.totalRecords = res['totalRecordsCount'];
          transations.forEach((transation) => {
            const transactionObj = {
              id: '',
              BusinessName: '',
              GameName: '',
              showType: '',
              UserName: '',
              status: '',
              amount: '',
              placeDate: '',
              details: {},
            };
            transactionObj.id = transation.id;
            transactionObj.BusinessName = transation.BusinessName;
            transactionObj.amount = transation.amount;
            transactionObj.GameName = transation.GameName;
            transactionObj.showType = transation.showType;
            transactionObj.UserName = transation.UserName;
            transactionObj.status = transation.status;
            transactionObj.placeDate = moment(transation.placeDate).format(
              'MM/DD/YYYY'
            );
            transactionObj.details = {
              displayValue: 'Get Details',
              type: 'button',
            };
            this.tableRows.push(transactionObj);
          });
          this.filteredData = this.tableRows = [...this.tableRows];
          // this.filteredData = [...this.tableRows];
          this.loading$ = of(false);
        } else if (res.error) {
          this.openSnackBar('Error occured while fetching My bets', 'error');
        }
      },
      (err) => {
        this.loading$ = of(false);
        this.openSnackBar('Error occured while fetching My bets', 'error');
        console.log(err);
      }
    );
  }

  getBids(params): void {
    this.loading$ = of(true);
    this.accountService.getBettings(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.tableRows = [];
          // this.statementForm.resetForm();
          const transations = res['bettings'];
          this.totalRecords = res['totalRecordsCount'];
          transations.forEach((transation) => {
            const transactionObj = {
              id: '',
              BusinessName: '',
              GameName: '',
              showType: '',
              UserName: '',
              status: '',
              amount: '',
              placeDate: '',
              details: {},
            };
            transactionObj.id = transation.id;
            transactionObj.BusinessName = transation.BusinessName;
            transactionObj.amount = transation.amount;
            transactionObj.GameName = transation.GameName;
            transactionObj.showType = transation.showType;
            transactionObj.UserName = transation.UserName;
            transactionObj.status = transation.status;
            transactionObj.placeDate = moment(transation.placeDate).format(
              'MM/DD/YYYY'
            );
            transactionObj.details = {
              displayValue: 'Get Details',
              type: 'button',
            };
            this.tableRows.push(transactionObj);
          });
          this.filteredData = this.tableRows = [...this.tableRows];
          // this.filteredData = [...this.tableRows];
          this.loading$ = of(false);
        } else if (res.error) {
          this.openSnackBar('Error occured while fetching My bets', 'error');
        }
      },
      (err) => {
        this.loading$ = of(false);
        this.openSnackBar('Error occured while fetching My bets', 'error');
        console.log(err);
      }
    );
  }

  filterData(event) {
    let val = event.target.value.toLowerCase();
    this.filteredData = this.tableRows.filter(function (item) {
      if (item.UserName.indexOf(val) !== -1 || !val) {
        return true;
      }
    });
  }

  onDownload(action, actionName) {
    const params = {
      fromDate: this.datePipe.transform(
        this.currentBetsForm.get('fromDate').value,
        'MM-dd-yyyy'
      ),
      toDate: this.datePipe.transform(
        this.currentBetsForm.get('toDate').value,
        'MM-dd-yyyy'
      ),
    };

    var str = '';
    if (actionName) {
      str = `download?action=${actionName}`;
    }
    if (action) {
      str = str + `&id=${action}`;
    }
    if (params.fromDate) {
      str = str + `&fromDate=${params.fromDate}`;
    }
    if (params.toDate) {
      str = str + `&toDate=${params.toDate}`;
    }
    window.open(str);
  }

  openSnackBar(message: string, className: string) {
    const snackBarConfigObject = {
      duration: 3000,
      data: message,
      panelClass: className,
    };
    this.matSnackBar.openFromComponent(SnackbarComponent, snackBarConfigObject);
  }

  onRowClicked($event) {
    if ($event) {
      if ($event.column.prop === 'details') {
        this.getBetDetails($event.row.id);
      }
    }
  }

  getBetDetails(id) {
    this.loading$ = of(true);
    this.accountService.getBetDetails({ id }).subscribe(
      (res: any) => {
        this.loading$ = of(false);
        let detailObj = {
          betDetails: res.details,
          action: 'getBetDetails',
          modalHeader: 'Bet Details',
        };
        this.openDialog(detailObj);
        console.log(res);
      },
      (err) => {
        this.loading$ = of(false);
        console.log(err);
      }
    );
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(ActionModalComponent, {
      data: event,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((actionModalResult) => {
      console.log(actionModalResult);
      console.log('The dialog was closed');
    });
  }

  pageEventChange(eventObj) {
    this.page = {
      size: eventObj.limit,
      totalElements: eventObj.count,
      totalPages: Math.ceil(eventObj.count / eventObj.limit),
      pageNumber: eventObj.offset,
    };
    this.onLoadRecordsClick();
  }
}
