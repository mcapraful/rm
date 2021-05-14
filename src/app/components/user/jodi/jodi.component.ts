import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserBidLogicHelperService } from '../../../services/user-bid-logic-helper.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts-service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { UtilService } from '../../../services/util-service';

@Component({
  selector: 'app-jodi',
  templateUrl: './jodi.component.html',
  styleUrls: ['./jodi.component.css'],
})
export class JodiComponent implements OnInit {

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

  //Time Business Logic Error
  openCloseTimeError = false;


  constructor(
    private userBidLogicHelperService: UserBidLogicHelperService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountService: AccountsService,
    private readonly userService: UserService,
    private matSnackBar: MatSnackBar
  ) {}

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
    this.jodiDigitsArray = this.userBidLogicHelperService.createJodiDigitsArray(
      0,
      100
    );
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

    if(this.checkTimeBusinessLogic()) {
      this.openCloseTimeError = true;
      return;
    }

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
    payload.total_amount = (+this.amount) * this.selectedjodiDigitsArray.length ;
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
        this.openSnackBar('Error occured while placing bid', 'error');
        console.log('Error occured in palcing bid', err);
      }
    );
  }

  checkTimeBusinessLogic() {
    return this.isOpenBidEndTimePassed || this.isCloseBidEndTimePassed
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
        // this.matkaBussiness.openTime = '00:05:00';
        // this.matkaBussiness.closeTime = '00:15:00';
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

    if(this.checkTimeBusinessLogic()) {
      this.openCloseTimeError = true;
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
        this.openCloseTimeError = this.checkTimeBusinessLogic();
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
