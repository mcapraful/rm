import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { profitLossTableMapping } from './profit-loss-table-mapping';
import { profitLossTableRows } from './profit-loss-table-data';
import { DatePipe } from '@angular/common';
import { AccountsService } from 'src/app/services/accounts-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { PageModel } from 'src/app/shared/page-model';
profitLossTableRows;
@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css'],
})
export class ProfitLossComponent implements OnInit {
  accountType; 
  clientNames = [];
  profitLossForm: FormGroup;
  options: Observable<string[]>;
  tableRows = [];
  tableColumns = [];
  totalRecords;
  datePipe: DatePipe = new DatePipe('en');
  loading$: Observable<boolean>;
  page = new PageModel();
  @ViewChild('formGroupDirective', { static: false }) statementForm;

  constructor(
    private readonly accountService: AccountsService,
    private readonly matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.accountType = sessionStorage.getItem('accountType');
    this.getClients();
    this.initProfitLossForm();
    this.setTableColumns();
    this.options = this.profitLossForm.get('clientName').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  setTableColumns() {
    this.tableColumns = profitLossTableMapping;
  }

  initProfitLossForm() {
    this.profitLossForm = new FormGroup({
      clientName: new FormControl('', Validators.required),
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
      const filterValue = value.toLowerCase();

      return this.clientNames.filter((option) =>
        option.toLowerCase().includes(filterValue)
      );
    }
  }

  onLoadRecordsClick() {
    const params = {
      fromdate: this.datePipe.transform(
        this.profitLossForm.get('fromDate').value,
        'MM/dd/yyyy'
      ),
      todate: this.datePipe.transform(
        this.profitLossForm.get('toDate').value,
        'MM/dd/yyyy'
      ),
      username: this.profitLossForm.get('clientName').value,
      pageIndex: this.page?.pageNumber ? this.page.pageNumber : 0,
      pageSize: this.page?.size ? this.page.size : 10,
    };
    this.loading$ = of(true);
    this.accountService.getProfitLoss(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.tableRows = [];
          const profitLossrecords = res['lstPLRecords'];
          this.totalRecords = res['totalRecordsCount'];
          profitLossrecords.forEach((record) => {
            const profitLossObj = {
              transactionDate: '',
              amount: '',
              transactionType: '',
              fromUserClosingBalance: '',
              fromUser: '',
              toUser: '',
              remark: '',
            };
            profitLossObj.transactionDate = record.transactionDate;
            profitLossObj.amount = record.amount;
            profitLossObj.transactionType = record.transactionType;
            profitLossObj.fromUserClosingBalance =
              record.fromUserClosingBalance;
            profitLossObj.fromUser = record.fromUser;
            profitLossObj.toUser = record.toUser;
            profitLossObj.remark = record.remark;
            this.tableRows.push(profitLossObj);
          });
          this.tableRows = [...this.tableRows];
          this.loading$ = of(false);
        } else if (res.error) {
          this.openSnackBar(
            'Error occured while fetching profit loss statements',
            'error'
          );
        }
      },
      (err) => {
        this.loading$ = of(false);
        this.openSnackBar(
          'Error occured while fetching profit loss statements',
          'error'
        );
        console.log(err);
      }
    );
  }

  onDownload(action, actionName) {
    const params = {
      fromDate: this.datePipe.transform(
        this.profitLossForm.get('fromDate').value,
        'MM-dd-yyyy'
      ),
      toDate: this.datePipe.transform(
        this.profitLossForm.get('toDate').value,
        'MM-dd-yyyy'
      ),
      username: this.profitLossForm.get('clientName').value,
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
