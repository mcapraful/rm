import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccountsService } from '../services/accounts-service';

@Injectable({
  providedIn: 'root',
})
export class AdminGaurdGuard implements CanActivate {
  constructor(
    private readonly accountService: AccountsService,
    public router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      ['Admin', 'SuperMaster', 'Master', 'Agent'].indexOf(
        sessionStorage.getItem('accountType')
      ) > -1
    ) {
      debugger;
      return true;
    } else {
      //debugger;
      //alert('Not authorized, Please log in first!');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('password');
      sessionStorage.removeItem('accountType');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
