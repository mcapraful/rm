import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RequestInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const Authorization = `Bearer ${sessionStorage.getItem('token')}`;
    const clonedRequest = httpRequest.clone({ setHeaders: { Authorization } });
    return next.handle(clonedRequest).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // If we get a new TOKEN set it so we use it going forward
            if (event.headers.has('Bearer')) {
              localStorage.setItem(
                'token',
                JSON.stringify(event.headers.get('Authorization'))
              );
            }
          }
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 || error.status === 0) {
              // this.httpError = true;
              console.log(
                'The session has expired or the user is not authorised.'
              );
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('username');
              sessionStorage.removeItem('password');
              sessionStorage.removeItem('accountType');
              this.router.navigate(['/login'], {
                queryParams: { expired: true },
              });
            }
            return throwError(error);
          }
        }
      )
    );
  }
}
