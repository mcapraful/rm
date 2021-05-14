import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { of, Subscription } from 'rxjs';
import { AccountsService } from '../../../services/accounts-service';
import { UserService } from '../../../services/user.service';
import { UserBidLogicHelperService } from '../../../services/user-bid-logic-helper.service';
import { UtilService } from '../../../services/util-service';
import { SnackbarComponent } from '../../snackbar/snackbar.component';

@Component({
  selector: 'app-sp-motor',
  templateUrl: './sp-motor.component.html',
  styleUrls: ['./sp-motor.component.css'],
})
export class SpMotorComponent implements OnInit, OnDestroy {

  now = moment(new Date());
  bidDate = '';

  possibilitiesArray = [];
  number;
  amount;
  showType;
  numberValidationError = false;

  loggedInUserInfo: any;
  bussinessId;
  gameId;
  paramsSubscription: Subscription;
  loading$ = of(false);
  noOfPossibilities = 4; // at any point of time SP motor would have 4 possibilities.
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

  getUserDetails(): void {
    this.loading$ = of(true);
    this.accountService.getLoggedInUserDetails().subscribe((res) => {
      this.loading$ = of(false);
      this.loggedInUserInfo = res['user'];
    });
  }

  onPlaceBetClick(): void {
    if (this.numberValidationError && !this.possibilitiesArray.length) {
      this.openSnackBar(
        'Please enter a valid 4 Digit Number in Ascending Order',
        'error'
      );
      return;
    }

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
    payload.total_amount = this.noOfPossibilities * +this.amount;
    payload.userId = this.loggedInUserInfo.id;
    payload.showType = this.showType;
    payload.dateTime = moment(this.bidDate, ['dddd, DD/MM/YYYY']).format('MM/DD/YYYY');

    this.possibilitiesArray.forEach((possibleNum) => {
      payload.arrBidInformation.push({
        number: possibleNum.value,
        amount: this.amount,
      });
    });
    this.loading$ = of(true);
    this.userService.placeBid(payload).subscribe(
      (res) => {
        if (res['success']) {
          this.loading$ = of(false);
          this.openSnackBar('Bet placed successfully.', 'success');
          this.getUserDetails();
          this.onResetClick();
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

  getMatkaBussinessById(id): void {
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

  openSnackBar(message: string, className: string): void {
    const snackBarConfigObject = {
      duration: 3000,
      data: message,
      panelClass: className,
    };
    this.matSnackBar.openFromComponent(SnackbarComponent, snackBarConfigObject);
  }

  generatePossibilitiesArray($event): void {
    // TODO: Move to constants
    const possibilityLength = 3;

    if (this.isValidNumber($event)) {
      this.possibilitiesArray = this.userBidLogicHelperService.spMotorDigitsArray(
        $event,
        possibilityLength
      );
      this.numberValidationError = false;
    } else {
      this.numberValidationError = true;
    }
  }

  isValidNumber(numberString): boolean {
    // TODO: Move to constants
    const minimumNumberLength = 4;

    if (numberString.length === minimumNumberLength) {
      return this.userBidLogicHelperService.isAscending(numberString);
    } else if (this.possibilitiesArray.length && numberString.length === 0) {
      this.onResetClick();
      return false;
    } else if (numberString.length < 4) {
      this.numberValidationError = true;
      return false;
    }
  }

  onResetClick(): void {
    this.number = this.amount = '';
    this.numberValidationError = false;
    this.possibilitiesArray = [];
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
