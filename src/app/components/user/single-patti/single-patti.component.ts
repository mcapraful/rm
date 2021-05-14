import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserBidLogicHelperService } from '../../../services/user-bid-logic-helper.service';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '../../../services/accounts-service';
import { UserService } from '../../../services/user.service';
import { Subscription, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { UtilService } from '../../../services/util-service';
@Component({
  selector: 'app-single-patti',
  templateUrl: './single-patti.component.html',
  styleUrls: ['./single-patti.component.css']
})
export class SinglePattiComponent implements OnInit {
  // this should come from backend, use this variable to store data from API
  masterPannaData = [
    {
      digits: [
        { index: 0, pannaIndex: 0, uiValue: '479', value: 479 },
        { index: 1, pannaIndex: 0, uiValue: '280', value: 280 },
        { index: 2, pannaIndex: 0, uiValue: '460', value: 460 },
        { index: 3, pannaIndex: 0, uiValue: '190', value: 190 },
        { index: 4, pannaIndex: 0, uiValue: '389', value: 389 },
        { index: 5, pannaIndex: 0, uiValue: '145', value: 145 },
        { index: 6, pannaIndex: 0, uiValue: '578', value: 578 },
        { index: 7, pannaIndex: 0, uiValue: '370', value: 370 },
        { index: 8, pannaIndex: 0, uiValue: '136', value: 136 },
        { index: 9, pannaIndex: 0, uiValue: '569', value: 569 },
        { index: 10, pannaIndex: 0, uiValue: '127', value: 127 },
        { index: 11, pannaIndex: 0, uiValue: '235', value: 235 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 1, uiValue: '137', value: 137 },
        { index: 1, pannaIndex: 1, uiValue: '146', value: 146 },
        { index: 2, pannaIndex: 1, uiValue: '236', value: 236 },
        { index: 3, pannaIndex: 1, uiValue: '245', value: 245 },
        { index: 4, pannaIndex: 1, uiValue: '290', value: 290 },
        { index: 5, pannaIndex: 1, uiValue: '380', value: 380 },
        { index: 6, pannaIndex: 1, uiValue: '470', value: 470 },
        { index: 7, pannaIndex: 1, uiValue: '489', value: 489 },
        { index: 8, pannaIndex: 1, uiValue: '560', value: 560 },
        { index: 9, pannaIndex: 1, uiValue: '579', value: 579 },
        { index: 10, pannaIndex: 1, uiValue: '678', value: 678 },
        { index: 11, pannaIndex: 1, uiValue: '128', value: 128 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 2, uiValue: '570', value: 570 },
        { index: 1, pannaIndex: 2, uiValue: '237', value: 237 },
        { index: 2, pannaIndex: 2, uiValue: '480', value: 480 },
        { index: 3, pannaIndex: 2, uiValue: '156', value: 156 },
        { index: 4, pannaIndex: 2, uiValue: '390', value: 390 },
        { index: 5, pannaIndex: 2, uiValue: '147', value: 147 },
        { index: 6, pannaIndex: 2, uiValue: '679', value: 679 },
        { index: 7, pannaIndex: 2, uiValue: '345', value: 345 },
        { index: 8, pannaIndex: 2, uiValue: '138', value: 138 },
        { index: 9, pannaIndex: 2, uiValue: '589', value: 589 },
        { index: 10, pannaIndex: 2, uiValue: '246', value: 246 },
        { index: 11, pannaIndex: 2, uiValue: '129', value: 129 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 3, uiValue: '580', value: 580 },
        { index: 1, pannaIndex: 3, uiValue: '238', value: 238 },
        { index: 2, pannaIndex: 3, uiValue: '490', value: 490 },
        { index: 3, pannaIndex: 3, uiValue: '157', value: 157 },
        { index: 4, pannaIndex: 3, uiValue: '346', value: 346 },
        { index: 5, pannaIndex: 3, uiValue: '148', value: 148 },
        { index: 6, pannaIndex: 3, uiValue: '689', value: 689 },
        { index: 7, pannaIndex: 3, uiValue: '256', value: 256 },
        { index: 8, pannaIndex: 3, uiValue: '139', value: 139 },
        { index: 9, pannaIndex: 3, uiValue: '670', value: 670 },
        { index: 10, pannaIndex: 3, uiValue: '247', value: 247 },
        { index: 11, pannaIndex: 3, uiValue: '120', value: 120 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 4, uiValue: '590', value: 590 },
        { index: 1, pannaIndex: 4, uiValue: '239', value: 239 },
        { index: 2, pannaIndex: 4, uiValue: '347', value: 347 },
        { index: 3, pannaIndex: 4, uiValue: '158', value: 158 },
        { index: 4, pannaIndex: 4, uiValue: '789', value: 789 },
        { index: 5, pannaIndex: 4, uiValue: '257', value: 257 },
        { index: 6, pannaIndex: 4, uiValue: '149', value: 149 },
        { index: 7, pannaIndex: 4, uiValue: '680', value: 680 },
        { index: 8, pannaIndex: 4, uiValue: '248', value: 248 },
        { index: 9, pannaIndex: 4, uiValue: '130', value: 130 },
        { index: 10, pannaIndex: 4, uiValue: '167', value: 167 },
        { index: 11, pannaIndex: 4, uiValue: '356', value: 356 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 5, uiValue: '456', value: 456 },
        { index: 1, pannaIndex: 5, uiValue: '249', value: 249 },
        { index: 2, pannaIndex: 5, uiValue: '357', value: 357 },
        { index: 3, pannaIndex: 5, uiValue: '230', value: 230 },
        { index: 4, pannaIndex: 5, uiValue: '348', value: 348 },
        { index: 5, pannaIndex: 5, uiValue: '168', value: 168 },
        { index: 6, pannaIndex: 5, uiValue: '780', value: 780 },
        { index: 7, pannaIndex: 5, uiValue: '159', value: 159 },
        { index: 8, pannaIndex: 5, uiValue: '690', value: 690 },
        { index: 9, pannaIndex: 5, uiValue: '258', value: 258 },
        { index: 10, pannaIndex: 5, uiValue: '140', value: 140 },
        { index: 11, pannaIndex: 5, uiValue: '267', value: 267 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 6, uiValue: '347', value: 347 },
        { index: 1, pannaIndex: 6, uiValue: '240', value: 240 },
        { index: 2, pannaIndex: 6, uiValue: '358', value: 358 },
        { index: 3, pannaIndex: 6, uiValue: '349', value: 349 },
        { index: 4, pannaIndex: 6, uiValue: '169', value: 169 },
        { index: 5, pannaIndex: 6, uiValue: '790', value: 790 },
        { index: 6, pannaIndex: 6, uiValue: '268', value: 268 },
        { index: 7, pannaIndex: 6, uiValue: '150', value: 150 },
        { index: 8, pannaIndex: 6, uiValue: '457', value: 457 },
        { index: 9, pannaIndex: 6, uiValue: '259', value: 259 },
        { index: 10, pannaIndex: 6, uiValue: '123', value: 123 },
        { index: 11, pannaIndex: 6, uiValue: '178', value: 178 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 7, uiValue: '458', value: 458 },
        { index: 1, pannaIndex: 7, uiValue: '269', value: 269 },
        { index: 2, pannaIndex: 7, uiValue: '368', value: 368 },
        { index: 3, pannaIndex: 7, uiValue: '250', value: 250 },
        { index: 4, pannaIndex: 7, uiValue: '359', value: 359 },
        { index: 5, pannaIndex: 7, uiValue: '179', value: 179 },
        { index: 6, pannaIndex: 7, uiValue: '890', value: 890 },
        { index: 7, pannaIndex: 7, uiValue: '340', value: 340 },
        { index: 8, pannaIndex: 7, uiValue: '160', value: 160 },
        { index: 9, pannaIndex: 7, uiValue: '467', value: 467 },
        { index: 10, pannaIndex: 7, uiValue: '278', value: 278 },
        { index: 11, pannaIndex: 7, uiValue: '124', value: 124 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 8, uiValue: '459', value: 459 },
        { index: 1, pannaIndex: 8, uiValue: '260', value: 260 },
        { index: 2, pannaIndex: 8, uiValue: '189', value: 189 },
        { index: 3, pannaIndex: 8, uiValue: '369', value: 369 },
        { index: 4, pannaIndex: 8, uiValue: '170', value: 170 },
        { index: 5, pannaIndex: 8, uiValue: '567', value: 567 },
        { index: 6, pannaIndex: 8, uiValue: '350', value: 350 },
        { index: 7, pannaIndex: 8, uiValue: '134', value: 134 },
        { index: 8, pannaIndex: 8, uiValue: '468', value: 468 },
        { index: 9, pannaIndex: 8, uiValue: '125', value: 125 },
        { index: 10, pannaIndex: 8, uiValue: '279', value: 279 },
        { index: 11, pannaIndex: 8, uiValue: '378', value: 378 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 9, uiValue: '469', value: 469 },
        { index: 1, pannaIndex: 9, uiValue: '234', value: 234 },
        { index: 2, pannaIndex: 9, uiValue: '450', value: 450 },
        { index: 3, pannaIndex: 9, uiValue: '270', value: 270 },
        { index: 4, pannaIndex: 9, uiValue: '379', value: 379 },
        { index: 5, pannaIndex: 9, uiValue: '180', value: 180 },
        { index: 6, pannaIndex: 9, uiValue: '568', value: 568 },
        { index: 7, pannaIndex: 9, uiValue: '360', value: 360 },
        { index: 8, pannaIndex: 9, uiValue: '135', value: 135 },
        { index: 9, pannaIndex: 9, uiValue: '478', value: 478 },
        { index: 10, pannaIndex: 9, uiValue: '289', value: 289 },
        { index: 11, pannaIndex: 9, uiValue: '126', value: 126 },
      ],
    },
  ];

  pannaData = {
    0: {data:[], isInitialized: false},
    1: {data:[], isInitialized: false},
    2: {data:[], isInitialized: false},
    3: {data:[], isInitialized: false},
    4: {data:[], isInitialized: false},
    5: {data:[], isInitialized: false},
    6: {data:[], isInitialized: false},
    7: {data:[], isInitialized: false},
    8: {data:[], isInitialized: false},
    9: {data:[], isInitialized: false},
  };

  toggleIndex = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
  };

  now = moment(new Date());
  bidDate = '';

  amount;
  showType;
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

  intializePannaDigits(index): void {
    if (this.pannaData[index].isInitialized) {
      this.toggleIndex[index] = !this.toggleIndex[index];
      return;
    }
    this.pannaData[index].data = this.masterPannaData[index].digits;
    this.toggleIndex[index] = !this.toggleIndex[index];
  }

  getToggleFlag(index) {
    return this.toggleIndex[index];
  }


  selectAndRemoveJodiDigit(jodiDigit, index): void {
    this.selectedjodiDigitsArray.push(jodiDigit);
    this.pannaData[index].data = this.pannaData[index].data.filter(
      (item) => !this.selectedjodiDigitsArray.includes(item)
    );
    this.sortBothArrays();
  }

  reset(): void {
    this.jodiDigitsArray = [];
    this.selectedjodiDigitsArray = [];
    this.resetState();
    this.amount = '';
  }

  resetState() {
    for(let i =0; i < 10; i++) {
      this.pannaData[0].isInitialized = false;
      this.toggleIndex[0] = false;
    }
  }

  remove(jodi): void {
    this.selectedjodiDigitsArray = this.selectedjodiDigitsArray.filter(
      (item) => item.index !== jodi.index
    );
    this.pannaData[jodi.pannaIndex].data.push(jodi);
    this.sortBothArrays();
    this.pannaData[jodi.pannaIndex].data = this.userBidLogicHelperService.sortArray(
      this.pannaData[jodi.pannaIndex].data,
      'index'
    );
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
      showType: '',
      matkaGameId: 0,
      total_amount: 0,
      matkaBusinessId: 0,
      userId: 0,
      arrBidInformation: [],
      dateTime: '',
    };
    payload.matkaGameId = +this.gameId;
    payload.matkaBusinessId = +this.bussinessId;
    payload.total_amount = (+this.amount) * (this.selectedjodiDigitsArray.length);
    payload.userId = this.loggedInUserInfo.id;
    payload.showType = this.showType;
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
        this.openSnackBar('Error occured while placing bid', 'error');
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
      panelClass: className,
    };
    this.matSnackBar.openFromComponent(SnackbarComponent, snackBarConfigObject);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
