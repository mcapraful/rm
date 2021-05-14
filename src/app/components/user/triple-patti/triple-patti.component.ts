import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts-service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from '../../../services/util-service';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
@Component({
  selector: 'app-triple-patti',
  templateUrl: './triple-patti.component.html',
  styleUrls: ['./triple-patti.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TriplePattiComponent implements OnInit {
  now = moment(new Date());
  bidDate = '';

  totalValue = 0;
  triplePattiForm: FormGroup;
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
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountService: AccountsService,
    private readonly userService: UserService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.initForm();

    this.triplePattiForm.valueChanges.subscribe((formObject) => {
      this.totalValue = 0;
      let atleastOneSelected = false;
      const object = { ...formObject };
      if (object['total'] || object['showType']) {
        delete object['total'];
        delete object['showType'];
      }

      for (let value in object) {
        if (object[value]) {
          atleastOneSelected = true;
          this.totalValue = this.totalValue + object[value];
        }
        this.triplePattiForm
          .get('total')
          .patchValue(this.totalValue, { emitEvent: false });
      }
      if (!atleastOneSelected) {
        this.triplePattiForm.setErrors({ invalid: true });
      }
    });

    this.paramsSubscription = this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.bussinessId = +params['bId'];
        this.gameId = +params['gId'];
        this.getMatkaBussinessById(this.bussinessId);
      }
    );
  }

  initForm(): void {
    this.triplePattiForm = new FormGroup({
      showType: new FormControl('', Validators.required),
      0: new FormControl('', Validators.min(5)),
      111: new FormControl('', Validators.min(5)),
      222: new FormControl('', Validators.min(5)),
      333: new FormControl('', Validators.min(5)),
      444: new FormControl('', Validators.min(5)),
      555: new FormControl('', Validators.min(5)),
      666: new FormControl('', Validators.min(5)),
      777: new FormControl('', Validators.min(5)),
      888: new FormControl('', Validators.min(5)),
      999: new FormControl('', Validators.min(5)),
      total: new FormControl(this.totalValue),
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
    const formObject = { ...this.triplePattiForm.value };
    if (formObject['total'] || formObject['showType']) {
      delete formObject['total'];
      delete formObject['showType'];
    }

    for (let obj in formObject) {
      if (formObject[obj]) {
        payload.arrBidInformation.push({
          number: obj === '0' ? '000' : +obj,
          amount: formObject[obj],
        });
      }
    }
    payload.matkaGameId = +this.gameId;
    payload.matkaBusinessId = +this.bussinessId;
    payload.total_amount = this.triplePattiForm.get('total').value;
    payload.userId = this.loggedInUserInfo.id;
    payload.showType = this.triplePattiForm.get('showType').value;
    payload.dateTime = moment(this.bidDate, ['dddd, DD/MM/YYYY']).format(
      'MM/DD/YYYY'
    );

    this.loading$ = of(true);
    this.userService.placeBid(payload).subscribe(
      (res) => {
        if (res['success']) {
          this.loading$ = of(false);
          this.triplePattiForm.reset();
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

  onResetClick(): void {
    this.triplePattiForm.reset();
  }

  getUserDetails() {
    this.loading$ = of(true);
    this.accountService.getLoggedInUserDetails().subscribe((res) => {
      this.loading$ = of(false);
      this.loggedInUserInfo = res['user'];
    });
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
