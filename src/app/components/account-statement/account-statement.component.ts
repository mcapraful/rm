import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { accountStatementTableRows } from './account-statement-table-data';
import { accountStatementTableMapping } from './account-statement-table-mapping';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AccountsService } from 'src/app/services/accounts-service';
import { DatePipe } from '@angular/common';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageModel } from 'src/app/shared/page-model';
@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css'],
})
export class AccountStatementComponent implements OnInit {
  clientNames = [];
  accounStatementTypes = ['All', 'Balance'];
  gameTypes = ['Carrom', 'Ludo'];
  clients: [];
  tableRows = [];
  tableColumns = [];
  totalRecords;
  accountType; 
  page = new PageModel();
  accountStatementForm: FormGroup;
  options: Observable<string[]>;
  datePipe: DatePipe = new DatePipe('en');
  loading$: Observable<boolean>;
  // @ViewChild('formGroupDirective', { static: false }) statementForm;

  constructor(
    private readonly accountService: AccountsService,
    private readonly matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.accountType = sessionStorage.getItem('accountType');
    this.getClients();
    this.initAccountStatementForm();
    this.getTableColumns();
    // this.getTablerows();
    this.options = this.accountStatementForm
      .get('clientName')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
  }

  getTableColumns() {
    this.tableColumns = accountStatementTableMapping;
  }

  initAccountStatementForm() {
    this.accountStatementForm = new FormGroup({
      accountStatementType: new FormControl(''),
      clientName: new FormControl(''),
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl('', Validators.required),
    });
  }

  getClients() {
    const params = {
      pageIndex: 0,
      pageSize: Number.MAX_VALUE,
      parentuserid: 18,
    };
    this.accountService.getAccountList(params).subscribe((res: any) => {
      console.log(res);
      const usersList = res['users'];
      usersList.forEach((user) => {
        this.clientNames.push(user['username']);
      });
    });
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value?.toLowerCase();

      return this.clientNames.filter((option) =>
        option.toLowerCase().includes(filterValue)
      );
    }
  }

  onLoadRecordsClick() {
    const params = {
      fromDate: this.datePipe.transform(
        this.accountStatementForm.get('fromDate').value,
        'MM/dd/yyyy'
      ),
      toDate: this.datePipe.transform(
        this.accountStatementForm.get('toDate').value,
        'MM/dd/yyyy'
      ),
      pageIndex: this.page?.pageNumber ? this.page.pageNumber : 0,
      pageSize: this.page?.size ? this.page.size : 10,
    };
    if (this.accountStatementForm.get('accountStatementType').value) {
      params['accountType'] = this.accountStatementForm.get(
        'accountStatementType'
      ).value;
    }
    if (this.accountStatementForm.get('clientName').value) {
      params['username'] = this.accountStatementForm.get('clientName').value;
    }

    this.loading$ = of(true);
    this.accountService.getAccountStatement(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.tableRows = [];
          const transations = res['transactions'];
          this.totalRecords = res['totalRecordsCount'];
          transations.forEach((transation) => {
            const transactionObj = {
              transactionDate: '',
              amount: '',
              transactionType: '',
              fromUserClosingBalance: '',
              fromUser: '',
              toUser: '',
              remark: '',
            };
            transactionObj.transactionDate = transation.transactionDate;
            transactionObj.amount = transation.amount;
            transactionObj.transactionType = transation.transactionType;
            transactionObj.fromUserClosingBalance =
              transation.fromUserClosingBalance;
            transactionObj.fromUser = transation.fromUser;
            transactionObj.toUser = transation.toUser;
            transactionObj.remark = transation.remark;
            this.tableRows.push(transactionObj);
          });
          this.tableRows = [...this.tableRows];
          this.loading$ = of(false);
        } else if (res.error) {
          this.openSnackBar(
            'Error occured while fetching account statements',
            'error'
          );
        }
      },
      (err) => {
        this.loading$ = of(false);
        this.openSnackBar(
          'Error occured while fetching account statements',
          'error'
        );
        console.log(err);
      }
    );
  }
  onDownload(action, actionName) {
    const params = {
      fromDate: this.datePipe.transform(
        this.accountStatementForm.get('fromDate').value,
        'MM-dd-yyyy'
      ),
      toDate: this.datePipe.transform(
        this.accountStatementForm.get('toDate').value,
        'MM-dd-yyyy'
      ),
      accountType: this.accountStatementForm.get('accountStatementType').value,

      username: this.accountStatementForm.get('clientName').value,
    };

    var str = "";
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
    if (params.accountType) {
      str = str + `&accountType=${params.accountType}`;
    }
    if (params.username) {
      str = str + `&username=${params.username}`;
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
