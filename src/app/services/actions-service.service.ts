import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';
import { API_DOMAIN, apiUrls } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class ActionsServiceService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly authsvc: AuthServiceService
  ) {}

  onDeposit(params) {
    return this.httpClient.post(API_DOMAIN + apiUrls.depositAmount, params);
  }

  onWithdraw(params) {
    return this.httpClient.post(API_DOMAIN + apiUrls.withdrawAmount, params);
  }

  onChangeLimit(params) {
    return this.httpClient.post(
      API_DOMAIN + apiUrls.changeExposureLimit,
      params
    );
  }

  onChangeCreditLimit(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.changeCreditAmount, {
      params: params,
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authsvc.getToken()}`,
      }),
    });
  }

  onChangeStatus(params) {
    return this.httpClient.get(API_DOMAIN + apiUrls.ChangeStatus, {
      params: params,
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authsvc.getToken()}`,
      }),
    });
  }

  onChangePassword(params) {
    return this.httpClient.post(API_DOMAIN + apiUrls.changePassword, params);
  }
}
