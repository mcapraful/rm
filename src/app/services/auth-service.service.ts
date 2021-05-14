import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_DOMAIN, apiUrls } from '../../constants';
@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private readonly httpClient: HttpClient) { }

  onLogin(params): any {
    return this.httpClient.post(API_DOMAIN + apiUrls.token, params);
  }

  public getToken(): string {
    return sessionStorage.getItem('token');
  }

  public getAccountType(): string {
    return sessionStorage.getItem('accountType');
  }
}
