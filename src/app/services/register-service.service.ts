import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_DOMAIN, apiUrls } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class RegisterServiceService {
  constructor(private readonly httpClient: HttpClient) {}

  onRegister(payload): any {
    return this.httpClient.post(
      API_DOMAIN + apiUrls.addnewuser,
      payload
    );
  }
}
