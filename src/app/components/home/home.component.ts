import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AccountsService } from '../../services/accounts-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav') sideNav: any;
  businessList = [];

  constructor(
    private accountService: AccountsService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.accountService.getMatkaBussinessList().subscribe((res) => {
      const bussinessListArray = res['BusinessList'];
      bussinessListArray.forEach((bussiness) => {
        const obj = {
          bussinessName: '',
          bussinessId: 0,
          openTime: '',
          closeTime: '',
        };
        obj.bussinessId = bussiness.id;
        obj.bussinessName = bussiness.name;
        obj.openTime = bussiness.openTime;
        obj.closeTime = bussiness.closeTime;
        this.businessList.push(obj);
      });
    });
  }

  ngAfterViewInit() { }

  onMenuClicked() {
    this.sideNav.toggle();
  }

  navigateToBusiness(businessName) {
    this.router.navigate(['/home/user/bid-type'], {
      queryParams: {
        bName: businessName,
      },
    });
    this.sideNav.toggle();
  }

}
