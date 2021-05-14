import { Component, OnInit } from '@angular/core';
import { userHomeTableMapping } from '../user-home/user-home-table-mapping';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountsService } from 'src/app/services/accounts-service';
import { ActionModalComponent } from '../../action-modal/action-modal.component';
import { UtilService } from '../../../services/util-service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent implements OnInit {
  homeTableRows = [];
  homeTableColumns = [];
  loading$: Observable<boolean>;
  bussinessInfoMap = new Map();
  totalRecords;
  constructor(
    private readonly userService: UserService,
    public readonly dialog: MatDialog,
    private readonly accountService: AccountsService
  ) {}

  ngOnInit(): void {
    this.getTableRows();
    this.getTableColums();
  }

  getTableRows() {
    this.loading$ = of(true);
    this.userService.getMatkaBussinesList().subscribe((res) => {
      if (res['success']) {
        const bussinesList = res['BusinessList'];
        bussinesList.forEach((bussiness) => {
          bussiness.openTime = bussiness.openTime ? UtilService.convertTimeToAmPm(bussiness.openTime) : null;
          bussiness.closeTime = bussiness.closeTime ? UtilService.convertTimeToAmPm(bussiness.closeTime) : null;

          const bussinessObject = {
            eventName: '',
            timeFrame: '',
            availableDays: '',
          };
          let availabelDays = '';
          if (bussiness.Mon) {
            availabelDays = `Mon`;
          }
          if (bussiness.Tue) {
            availabelDays = `${availabelDays}, Tue`;
          }
          if (bussiness.Wed) {
            availabelDays = `${availabelDays}, Wed`;
          }
          if (bussiness.Thur) {
            availabelDays = `${availabelDays}, Thur`;
          }
          if (bussiness.Fri) {
            availabelDays = `${availabelDays}, Fri`;
          }
          if (bussiness.Sat) {
            availabelDays = `${availabelDays}, Sat`;
          }
          if (bussiness.Sun) {
            availabelDays = `${availabelDays}, Sun`;
          }
          this.bussinessInfoMap.set(bussiness.name, {
            bussinessName: bussiness.name,
            bussinessId: bussiness.id,
            availabelDays: availabelDays,
            openTimings: bussiness.openTime,
            closeTimings: bussiness.closeTime,
          });

          bussinessObject.eventName = bussiness.name;
          bussinessObject.timeFrame = `${bussiness.openTime} - ${bussiness.closeTime}`;
          bussinessObject.availableDays = availabelDays;
          this.homeTableRows.push(bussinessObject);
        });
        this.userService.bussinessInfoMap = this.bussinessInfoMap;
        this.userService.bussinessInfoMap$.next(this.bussinessInfoMap);
        this.homeTableRows = [...this.homeTableRows];
        this.totalRecords = this.homeTableRows.length;
        this.loading$ = of(false);
        console.log(this.bussinessInfoMap);
      }
    });
  }

  getTableColums() {
    this.homeTableColumns = userHomeTableMapping;
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
}
