import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { UtilService } from '../../../services/util-service';
@Component({
  selector: 'app-bid-type',
  templateUrl: './bid-type.component.html',
  styleUrls: ['./bid-type.component.css'],
})
export class BidTypeComponent implements OnInit {
  @Input() eventData;
  @Input() matkaGames;
  bussinessName;
  bussinessInfoMap = new Map();
  loading$: Observable<boolean>;
  paramsSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getMatkaGames();
    this.getBidType();
    this.paramsSubscription = this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.bussinessName = params['bName'];
        this.getBidType();
      }
    );
  }

  navigateToRoute(route, gameName: string): void {
    const game = this.matkaGames.find((gameObj) => {
      if (gameObj.name === gameName) {
        return gameObj;
      }
    });
    console.log(this.eventData.bussinessId);
    this.router.navigate([route], {
      queryParams: {
        bId: this.eventData.bussinessId,
        gId: game.id,
      },
    });
  }

  getMatkaGames() {
    this.loading$ = of(true);
    this.userService.getMatkaGames().subscribe((res) => {
      this.loading$ = of(false);
      this.matkaGames = res['games'];
    });
  }

  getBidType() {
    if (this.userService.bussinessInfoMap) {
      this.loading$ = of(true);
      this.eventData = this.userService.bussinessInfoMap.get(
        this.bussinessName
      );
      this.loading$ = of(false);
    } else {
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
              availabelDays,
              openTimings: bussiness.openTime,
              closeTimings: bussiness.closeTime,
            });

            bussinessObject.eventName = bussiness.name;
            bussinessObject.timeFrame = `${bussiness.openTime} - ${bussiness.closeTime}`;
            bussinessObject.availableDays = availabelDays;
          });
          this.eventData = this.bussinessInfoMap.get(this.bussinessName);
          this.userService.bussinessInfoMap$.next(this.bussinessInfoMap);
          this.loading$ = of(false);
          console.log(this.bussinessInfoMap);
        }
      });
    }
  }
}
