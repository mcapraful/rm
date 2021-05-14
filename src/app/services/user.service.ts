import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { API_DOMAIN, apiUrls } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  matkaGames = new Subject();
  matkaBussinessList;
  bussinessInfoMap;
  bussinessInfoMap$ = new Subject();
  constructor(private readonly httpClient: HttpClient) { }

  getMatkaBussinesList() {
    return this.httpClient.get(
      API_DOMAIN + apiUrls.getMatkaBusinessList
    );
  }

  getMatkaGames() {
    return this.httpClient.get(
      API_DOMAIN + apiUrls.getmatkagames
    );
  }

  placeBid(payload) {
    return this.httpClient.post(
      API_DOMAIN + apiUrls.placebid,
      payload
    );
  }

  marketAnalysis(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.getMarketAnalysis, {
      params,
    });
  }
}
