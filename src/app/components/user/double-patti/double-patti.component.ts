import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { AccountsService } from '../../../services/accounts-service';
import { UserService } from '../../../services/user.service';
import { UserBidLogicHelperService } from '../../../services/user-bid-logic-helper.service';
import { UtilService } from '../../../services/util-service';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
@Component({
  selector: 'app-double-patti',
  templateUrl: './double-patti.component.html',
  styleUrls: ['./double-patti.component.css'],
})
export class DoublePattiComponent implements OnInit {
  paramsSubscription: Subscription;
  loggedInUserInfo;
  bussinessId;
  gameId;
  showType;
  loading$: Observable<boolean>;

  // this should come from backend, use this variable to store data from API
  masterPannaData = [
    {
      digits: [
        { index: 0, pannaIndex: 0, uiValue: '226', value: 226 },
        { index: 1, pannaIndex: 0, uiValue: '668', value: 668 },
        { index: 2, pannaIndex: 0, uiValue: '488', value: 488 },
        { index: 3, pannaIndex: 0, uiValue: '118', value: 118 },
        { index: 4, pannaIndex: 0, uiValue: '334', value: 334 },
        { index: 5, pannaIndex: 0, uiValue: '299', value: 299 },
        { index: 6, pannaIndex: 0, uiValue: '550', value: 550 },
        { index: 7, pannaIndex: 0, uiValue: '244', value: 244 },
        { index: 8, pannaIndex: 0, uiValue: '677', value: 677 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 1, uiValue: '100', value: 100 },
        { index: 1, pannaIndex: 1, uiValue: '335', value: 335 },
        { index: 2, pannaIndex: 1, uiValue: '344', value: 344 },
        { index: 3, pannaIndex: 1, uiValue: '119', value: 119 },
        { index: 4, pannaIndex: 1, uiValue: '399', value: 399 },
        { index: 5, pannaIndex: 1, uiValue: '155', value: 155 },
        { index: 6, pannaIndex: 1, uiValue: '588', value: 588 },
        { index: 7, pannaIndex: 1, uiValue: '227', value: 227 },
        { index: 8, pannaIndex: 1, uiValue: '669', value: 669 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 2, uiValue: '200', value: 200 },
        { index: 1, pannaIndex: 2, uiValue: '336', value: 336 },
        { index: 2, pannaIndex: 2, uiValue: '499', value: 499 },
        { index: 3, pannaIndex: 2, uiValue: '110', value: 110 },
        { index: 4, pannaIndex: 2, uiValue: '660', value: 660 },
        { index: 5, pannaIndex: 2, uiValue: '228', value: 228 },
        { index: 6, pannaIndex: 2, uiValue: '688', value: 688 },
        { index: 7, pannaIndex: 2, uiValue: '255', value: 255 },
        { index: 8, pannaIndex: 2, uiValue: '778', value: 778 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 3, uiValue: '300', value: 300 },
        { index: 1, pannaIndex: 3, uiValue: '355', value: 355 },
        { index: 2, pannaIndex: 3, uiValue: '445', value: 445 },
        { index: 3, pannaIndex: 3, uiValue: '166', value: 166 },
        { index: 4, pannaIndex: 3, uiValue: '599', value: 599 },
        { index: 5, pannaIndex: 3, uiValue: '229', value: 229 },
        { index: 6, pannaIndex: 3, uiValue: '779', value: 779 },
        { index: 7, pannaIndex: 3, uiValue: '337', value: 337 },
        { index: 8, pannaIndex: 3, uiValue: '788', value: 788 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 4, uiValue: '400', value: 400 },
        { index: 1, pannaIndex: 4, uiValue: '338', value: 338 },
        { index: 2, pannaIndex: 4, uiValue: '446', value: 446 },
        { index: 3, pannaIndex: 4, uiValue: '112', value: 112 },
        { index: 4, pannaIndex: 4, uiValue: '455', value: 455 },
        { index: 5, pannaIndex: 4, uiValue: '220', value: 220 },
        { index: 6, pannaIndex: 4, uiValue: '699', value: 699 },
        { index: 7, pannaIndex: 4, uiValue: '266', value: 266 },
        { index: 8, pannaIndex: 4, uiValue: '770', value: 770 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 5, uiValue: '500', value: 500 },
        { index: 1, pannaIndex: 5, uiValue: '339', value: 339 },
        { index: 2, pannaIndex: 5, uiValue: '366', value: 366 },
        { index: 3, pannaIndex: 5, uiValue: '113', value: 113 },
        { index: 4, pannaIndex: 5, uiValue: '447', value: 447 },
        { index: 5, pannaIndex: 5, uiValue: '122', value: 122 },
        { index: 6, pannaIndex: 5, uiValue: '779', value: 779 },
        { index: 7, pannaIndex: 5, uiValue: '177', value: 177 },
        { index: 8, pannaIndex: 5, uiValue: '889', value: 889 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 6, uiValue: '600', value: 600 },
        { index: 1, pannaIndex: 6, uiValue: '448', value: 448 },
        { index: 2, pannaIndex: 6, uiValue: '466', value: 466 },
        { index: 3, pannaIndex: 6, uiValue: '114', value: 114 },
        { index: 4, pannaIndex: 6, uiValue: '556', value: 556 },
        { index: 5, pannaIndex: 6, uiValue: '277', value: 277 },
        { index: 6, pannaIndex: 6, uiValue: '880', value: 880 },
        { index: 7, pannaIndex: 6, uiValue: '330', value: 330 },
        { index: 8, pannaIndex: 6, uiValue: '899', value: 899 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 7, uiValue: '700', value: 700 },
        { index: 1, pannaIndex: 7, uiValue: '223', value: 223 },
        { index: 2, pannaIndex: 7, uiValue: '377', value: 377 },
        { index: 3, pannaIndex: 7, uiValue: '115', value: 115 },
        { index: 4, pannaIndex: 7, uiValue: '449', value: 449 },
        { index: 5, pannaIndex: 7, uiValue: '133', value: 133 },
        { index: 6, pannaIndex: 7, uiValue: '557', value: 557 },
        { index: 7, pannaIndex: 7, uiValue: '188', value: 188 },
        { index: 8, pannaIndex: 7, uiValue: '566', value: 566 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 8, uiValue: '800', value: 800 },
        { index: 1, pannaIndex: 8, uiValue: '288', value: 288 },
        { index: 2, pannaIndex: 8, uiValue: '440', value: 440 },
        { index: 3, pannaIndex: 8, uiValue: '116', value: 116 },
        { index: 4, pannaIndex: 8, uiValue: '477', value: 477 },
        { index: 5, pannaIndex: 8, uiValue: '224', value: 224 },
        { index: 6, pannaIndex: 8, uiValue: '558', value: 558 },
        { index: 7, pannaIndex: 8, uiValue: '233', value: 233 },
        { index: 8, pannaIndex: 8, uiValue: '990', value: 990 },
      ],
    },
    {
      digits: [
        { index: 0, pannaIndex: 9, uiValue: '900', value: 900 },
        { index: 1, pannaIndex: 9, uiValue: '225', value: 225 },
        { index: 2, pannaIndex: 9, uiValue: '388', value: 388 },
        { index: 3, pannaIndex: 9, uiValue: '117', value: 117 },
        { index: 4, pannaIndex: 9, uiValue: '559', value: 559 },
        { index: 5, pannaIndex: 9, uiValue: '144', value: 144 },
        { index: 6, pannaIndex: 9, uiValue: '577', value: 577 },
        { index: 7, pannaIndex: 9, uiValue: '199', value: 199 },
        { index: 8, pannaIndex: 9, uiValue: '667', value: 667 },
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
  jodiDigitsArray = [];
  selectedjodiDigitsArray = [];
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
    this.pannaData[index].isInitialized = true;
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
    this.amount = 0;
    this.resetState();
    this.amount = ''
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
      matkaGameId: 0,
      total_amount: 0,
      matkaBusinessId: 0,
      userId: 0,
      arrBidInformation: [],
      showType: '',
      dateTime: '',
    };
    payload.matkaGameId = +this.gameId;
    payload.matkaBusinessId = +this.bussinessId;
    payload.total_amount = +this.amount * this.selectedjodiDigitsArray.length;
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
