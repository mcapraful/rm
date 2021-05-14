import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-book-show',
  templateUrl: './book-show.component.html',
  styleUrls: ['./book-show.component.css'],
})
export class BookShowComponent implements OnInit {
  panelOpenState = false;
  masterAnalysisData: any = {};
  bussinessInfoMap = new Map();
  gameInfoMap = new Map();
  bussinesList: any;
  gamesList: any;
  dataList: any;

  constructor(private readonly userService: UserService) {

  }

  ngOnInit(): void {
    this.getBusinessList();
    this.getGamesList();
  }

  getBusinessList() {
    this.userService.getMatkaBussinesList().subscribe((res) => {
      if (res['success']) {
        this.bussinesList = res['BusinessList'];
      }
    });
  }

  getGamesList() {
    this.userService.getMatkaGames().subscribe((res) => {
      if (res['success']) {
        this.gamesList = res['games'];
      }
    });
  }

  onGamePanelClick(businessId, gameId): void {
    const params = {
      matkaBusinessId: businessId,
      matkaGameId: gameId
    };

    if (this.masterAnalysisData[businessId] && this.masterAnalysisData[businessId][gameId] && this.masterAnalysisData[businessId][gameId].isDataLoaded) {
      console.log('Data already loaded not making call for', this.masterAnalysisData[businessId][gameId]);
      return
    }

    this.userService.marketAnalysis(params).subscribe((res) => {
      if (res['success']) {
        this.masterAnalysisData[businessId] = this.masterAnalysisData[businessId] ? { ...this.masterAnalysisData[businessId] } : {};
        this.masterAnalysisData[businessId][gameId] = {};
        this.masterAnalysisData[businessId][gameId].data = res['data'];
        this.masterAnalysisData[businessId][gameId].isDataLoaded = true;
      }
    });
  }


}
