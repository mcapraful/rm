import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserBidLogicHelperService } from '../../../services/user-bid-logic-helper.service';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from 'src/app/services/accounts-service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { UtilService } from '../../../services/util-service';

@Component({
  selector: 'app-red-bracket',
  templateUrl: './red-bracket.component.html',
  styleUrls: ['./red-bracket.component.css'],
})
export class RedBracketComponent implements OnInit {
  now = moment(new Date());
  bidDate = '';

  amount;
  jodiDigitsArray = [];
  selectedjodiDigitsArray = [];
  paramsSubscription: Subscription;
  loggedInUserInfo;
  bussinessId;
  gameId;
  loading$: Observable<boolean>;
  matkaBussiness;
  activeBusinessDays;

  // Open - Close Bid deadlines.
  openBidEndTime;
  closeBidEndTime;

  // Deadline passed ?
  isOpenBidEndTimePassed;
  isCloseBidEndTimePassed;

  constructor(
    private userBidLogicHelperService: UserBidLogicHelperService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountService: AccountsService,
    private readonly userService: UserService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.paramsSubscription = this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.bussinessId = +params['bId'];
        this.gameId = +params['gId'];
        this.getMatkaBussinessById(this.bussinessId);
      }
    );
  }

  sortBothArrays(): void {
    this.jodiDigitsArray = this.userBidLogicHelperService.sortArray(
      this.jodiDigitsArray,
      'index'
    );
    this.selectedjodiDigitsArray = this.userBidLogicHelperService.sortArray(
      this.selectedjodiDigitsArray,
      'index'
    );
  }

  intializeJodi(): void {
    if (this.jodiDigitsArray.length) {
      return;
    }
    this.jodiDigitsArray = [
      {
        index: 0,
        uiValue: '11',
        value: 11,
      },
      {
        index: 1,
        uiValue: '16',
        value: 16,
      },
      {
        index: 2,
        uiValue: '22',
        value: 22,
      },
      {
        index: 3,
        uiValue: '27',
        value: 27,
      },
      {
        index: 4,
        uiValue: '33',
        value: 33,
      },
      {
        index: 5,
        uiValue: '38',
        value: 38,
      },
      {
        index: 6,
        uiValue: '44',
        value: 44,
      },
      {
        index: 7,
        uiValue: '49',
        value: 49,
      },
      {
        index: 8,
        uiValue: '55',
        value: 55,
      },
      {
        index: 9,
        uiValue: '50',
        value: 50,
      },
      {
        index: 10,
        uiValue: '66',
        value: 66,
      },
      {
        index: 11,
        uiValue: '61',
        value: 61,
      },
      {
        index: 12,
        uiValue: '77',
        value: 77,
      },
      {
        index: 13,
        uiValue: '72',
        value: 72,
      },
      {
        index: 14,
        uiValue: '88',
        value: 88,
      },
      {
        index: 15,
        uiValue: '83',
        value: 83,
      },
      {
        index: 16,
        uiValue: '99',
        value: 99,
      },
      {
        index: 17,
        uiValue: '94',
        value: 94,
      },
      {
        index: 18,
        uiValue: '00',
        value: 0,
      },
      {
        index: 19,
        uiValue: '05',
        value: 5,
      },
    ];
  }

  selectAndRemoveJodiDigit(jodiDigit): void {
    this.selectedjodiDigitsArray.push(jodiDigit);
    this.jodiDigitsArray = this.jodiDigitsArray.filter(
      (item) => !this.selectedjodiDigitsArray.includes(item)
    );
    this.sortBothArrays();
  }

  reset(): void {
    this.jodiDigitsArray = [];
    this.selectedjodiDigitsArray = [];
    this.amount = 0;
  }

  remove(jodi): void {
    this.selectedjodiDigitsArray = this.selectedjodiDigitsArray.filter(
      (item) => item.index !== jodi.index
    );
    this.jodiDigitsArray.push(jodi);
    this.sortBothArrays();
  }

  getUserDetails() {
    this.loading$ = of(true);
    this.accountService.getLoggedInUserDetails().subscribe((res) => {
      this.loading$ = of(false);
      this.loggedInUserInfo = res['user'];
    });
  }

  onPlaceBetClick() {
    const payload = {
      matkaGameId: 0,
      total_amount: 0,
      matkaBusinessId: 0,
      userId: 0,
      arrBidInformation: [],
      dateTime: '',
    };
    payload.matkaGameId = +this.gameId;
    payload.matkaBusinessId = +this.bussinessId;
    payload.total_amount = +this.amount;
    payload.userId = this.loggedInUserInfo.id;
    payload.dateTime = moment(this.bidDate, ['dddd, DD/MM/YYYY']).format('MM/DD/YYYY');

    this.selectedjodiDigitsArray.forEach((jodiObj) => {
      payload.arrBidInformation.push({
        number: jodiObj.value,
        amount: +this.amount,
      });
    });
    this.loading$ = of(true);
    this.userService.placeBid(payload).subscribe(
      (res) => {
        if (res['success']) {
          this.loading$ = of(false);
          this.openSnackBar('Bet placed successfully.', 'success');
          this.getUserDetails();
          this.reset();
        } else if (res['error']) {
          this.loading$ = of(false);
          this.openSnackBar(res['error'], 'error');
        }
      },
      (err) => {
        this.loading$ = of(false);
        this.openSnackBar('Error occured while placing bid.', 'error');
        console.log('Error occured in palcing bid', err);
      }
    );
  }

  getMatkaBussinessById(id) {
    this.userService.getMatkaBussinesList().subscribe((res) => {
      if (res['success']) {
        const bussinesList = res['BusinessList'];
        this.matkaBussiness = bussinesList.find((bussiness) => {
          if (bussiness.id === id) {
            return bussiness;
          }
        });
        // Uncomment for testing
        // this.matkaBussiness.openTime = '21:20:00';
        // this.matkaBussiness.closeTime = '23:30:00';
        this.matkaBussiness.openTime = this.matkaBussiness.openTime
          ? UtilService.convertTimeToAmPm(this.matkaBussiness.openTime)
          : null;
        this.matkaBussiness.closeTime = this.matkaBussiness.closeTime
          ? UtilService.convertTimeToAmPm(this.matkaBussiness.closeTime)
          : null;
        this.openBidEndTime = UtilService.subtractMinutesFromTime(
          this.matkaBussiness.openTime,
          10
        );
        this.closeBidEndTime = UtilService.subtractMinutesFromTime(
          this.matkaBussiness.closeTime,
          10
        );
        this.activeBusinessDays = UtilService.getBusinessActiveDays(
          this.matkaBussiness
        );
        this.calculateBidDate(this.now);
        this.enableOpenClose();
        this.loading$ = of(false);
      }
    });
  }

  calculateBidDate(date): void {
    if (this.activeBusinessDays.length) {
      let businessDayFound = this.activeBusinessDays.find(
        (item) => item.weekSting === moment(date).format('ddd')
      );
      if (businessDayFound) {
        this.bidDate = date.format('dddd, DD/MM/YYYY');
      } else {
        let daysToAdd = 0;
        for (daysToAdd; daysToAdd < 6; daysToAdd++) {
          businessDayFound = this.activeBusinessDays.find(
            (item) =>
              item.weekString === moment(date).add(daysToAdd, 'd').format('ddd')
          );
          if (businessDayFound) {
            break;
          }
        }
        this.bidDate = date.add(daysToAdd, 'd').format('dddd, DD/MM/YYYY');
      }
      this.isOpenBidEndTimePassed =
        UtilService.timeDifferenceInMins(
          this.openBidEndTime,
          moment(date).format('hh:mm A')
        ) <= 0;
      this.isCloseBidEndTimePassed =
        UtilService.timeDifferenceInMins(
          this.closeBidEndTime,
          moment(date).format('hh:mm A')
        ) <= 0;
    }
  }

  enableOpenClose(): void {
    let isCloseTimePassed: boolean; // when true means, the open and close result have been displayed for the day.
    if (this.closeBidEndTime && this.now) {
      isCloseTimePassed =
        UtilService.timeDifferenceInMins(
          this.matkaBussiness.closeTime,
          moment(this.now).format('hh:mm A')
        ) <= 0;
      if (isCloseTimePassed) {
        // open bid for next day.
        this.calculateBidDate(moment(this.now).add(1, 'd'));
        this.isOpenBidEndTimePassed = this.isCloseBidEndTimePassed = false;
      }
    }
  }

  openSnackBar(message: string, className: string) {
    const snackBarConfigObject = {
      duration: 3000,
      data: message,
      panelClass: className
    };
    this.matSnackBar.openFromComponent(SnackbarComponent, snackBarConfigObject);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
