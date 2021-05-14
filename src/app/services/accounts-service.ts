import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrls, API_DOMAIN } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  public currentPageAccountsList: any;
  public loggedInUserDetails: any;
  public matkaBussinessObj: any;
  constructor(private readonly httpClient: HttpClient) {
    // this.accountsList = tableRows;
  }

  getAccountList(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.getClients, {
      params,
    });
  }

  getAccountDataById(id: number) {
    const account = this.currentPageAccountsList.find((acc) => {
      return acc.id === id;
    });
    return account;
  }

  getBalance(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.getBalance, {
      params,
    });
  }

  getLoggedInUserDetails() {
    return this.httpClient.get(API_DOMAIN + apiUrls.getUserDetail);
  }

  getMatkaBussinessList() {
    return this.httpClient.get(API_DOMAIN + apiUrls.getMatkaBusinessList);
  }

  addMatkaResult(body) {
    return this.httpClient.post(API_DOMAIN + apiUrls.addMatkaResult, body);
  }

  getMatkaResults() {
    return this.httpClient.get(API_DOMAIN + apiUrls.getMatkaResults);
  }

  getAccountStatement(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.getAccountStatement, {
      params,
    });
  }

  getProfitLoss(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.getProfitLoss, { params });
  }

  getBettings(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.getBettings, { params });
  }

  getCurrentBets() {
    return this.httpClient.get(API_DOMAIN + apiUrls.getCurrentBets);
  }

  getBetDetails(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.getBetDetails, {
      params,
    });
  }
}
