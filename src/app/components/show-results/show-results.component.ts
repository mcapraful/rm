import { Component, OnInit } from '@angular/core';
import { AccountsService } from 'src/app/services/accounts-service';
import { Observable, of } from 'rxjs';
import { UtilService } from 'src/app/services/util-service';

@Component({
  selector: 'app-show-results',
  templateUrl: './show-results.component.html',
  styleUrls: ['./show-results.component.css'],
})
export class ShowResultsComponent implements OnInit {
  allMatkaResults: [] = [];
  upcomingResults = [];
  loading$: Observable<boolean>;
  constructor(private readonly accountService: AccountsService) {}

  ngOnInit(): void {
    this.getMatkaResults();
  }

  getMatkaResults() {
    this.loading$ = of(true);
    this.accountService.getMatkaResults().subscribe((res) => {
      if (res['success']) {
        this.allMatkaResults = res['results'];
        this.allMatkaResults.forEach((resultObj: any) => {
          if (resultObj.result === 'Loading') {
            this.upcomingResults.push(resultObj);
          }
          resultObj.openTime = resultObj.openTime ? UtilService.convertTimeToAmPm(resultObj.openTime): null;
          resultObj.closeTime = resultObj.closeTime ? UtilService.convertTimeToAmPm(resultObj.closeTime): null;
        });
        this.loading$ = of(false);
      } else {
        this.loading$ = of(false);
        console.log('Error occured in fetching results!');
      }
    });
  }
}
