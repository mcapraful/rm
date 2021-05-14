import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts-service';
import { ActivatedRoute } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-data-download',
  templateUrl: './pdf-download.component.html',
  styleUrls: ['./pdf-download.component.css'],
})
export class PdfExcelDownloadComponent implements OnInit {
  loggedInUser: any;
  totalRecords: any;
  recordsCount: any;
  id: any;
  toDate: any;
  fromDate: any;
  accountType: any;
  username: any;
  transationDetails: any;
  bettingTransations: any;
  profitLossTransations: any;
  action: string;
  loading$: Observable<boolean>;
  exportAsConfig: ExportAsConfig = {
    type: 'xlsx', // the type you want to download
    elementIdOrContent: 'data-table-dwn', // the id of html/table element
  };

  constructor(
    private readonly accountService: AccountsService,
    private activatedRoute: ActivatedRoute,
    private readonly exportAsService: ExportAsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.action = params['action'];
      this.id = params['id'];
      this.fromDate = params['fromDate'];
      this.toDate = params['toDate'];
      this.accountType = params['accountType'];
      this.username = params['username'];
      this.getLoggedInUserInfo();
    });
  }

  getLoggedInUserInfo() {
    this.loading$ = of(true);
    this.accountService.getLoggedInUserDetails().subscribe(
      (res) => {
        if (res['success']) {
          this.loggedInUser = this.accountService.loggedInUserDetails =
            res['user'];
          if (this.id == 'accountStatement') {
            this.getAccountDetails();
          } else if (this.id == 'ClientDetails') {
            this.getClientDetails();
          } else if (this.id == 'CurrentBet') {
            this.getCurrentBetDetails();
          } else if (this.id == 'ProfitLoss') {
            this.getProfitLossDetails();
          } else {
          }
        } else if (res['error']) {
          this.loading$ = of(false);
          console.log('Error occured while fetching user details', res);
        } else {
          console.log();
        }
      },
      (err) => {
        this.loading$ = of(false);
        console.log('Error occured', err);
      }
    );
  }
  getProfitLossDetails() {
    const params = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      username: this.username,
    };
    this.accountService.getProfitLoss(params).subscribe(
      (res) => {
        this.profitLossTransations = res['lstPLRecords'];
        this.loading$ = of(false);
      },
      (err) => {
        this.loading$ = of(false);
        console.log('Error occured while fetching users data', err);
      }
    );
  }
  getCurrentBetDetails() {
    const params = {
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.accountService.getBettings(params).subscribe(
      (res) => {
        this.bettingTransations = res['bettings'];
        this.loading$ = of(false);
      },
      (err) => {
        this.loading$ = of(false);
        console.log('Error occured while fetching users data', err);
      }
    );
  }
  getAccountDetails() {
    const params = {
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    if (this.accountType !== undefined) {
      params['accountType'] = this.accountType;
    }
    if (this.username !== undefined) {
      params['username'] = this.username;
    }
    this.accountService.getAccountStatement(params).subscribe(
      (res) => {
        this.transationDetails = res['transactions'];
        this.loading$ = of(false);
      },
      (err) => {
        this.loading$ = of(false);
        console.log('Error occured while fetching users data', err);
      }
    );
  }
  getClientDetails() {
    const params = {
      pageIndex: 0,
      pageSize: 0,
      parentuserid: this.loggedInUser.id,
    };
    this.accountService.getAccountList(params).subscribe(
      (res) => {
        this.recordsCount = res['totalrecordsCount'];
        const params = {
          pageIndex: 0,
          pageSize: this.recordsCount,
          parentuserid: this.loggedInUser.id,
        };
        this.accountService.getAccountList(params).subscribe((res) => {
          console.log(res['users']);
          this.totalRecords = res['users'];
        });
        this.loading$ = of(false);
      },
      (err) => {
        this.loading$ = of(false);
        console.log('Error occured while fetching users data', err);
      }
    );
  }

  onClick() {
    var printButton = document.getElementById('printpagebutton');
    printButton.style.visibility = 'hidden';
    window.print();
    printButton.style.visibility = 'visible';
  }

  onDownLoadExcel() {
    this.exportAsService.save(this.exportAsConfig, 'data_excel').subscribe(
      (res) => {
        console.log('Excel downlaoded', res);
      },
      (err) => {
        console.log('Error while downlaoding excel', err);
      }
    );

    this.exportAsService.get(this.exportAsConfig).subscribe((content) => {
      console.log(content);
    });
  }
}
