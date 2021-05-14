import { Component, HostListener, OnInit } from '@angular/core';
import { AccountsService } from './services/accounts-service';
import { UtilService } from './services/util-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title = 'rm11-ui';

  ngOnInit(): void {
    // tslint:disable-next-line:no-string-literal
    window['mediaPort'] = UtilService.getMedia();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    // tslint:disable-next-line:no-string-literal
    window['mediaPort'] = UtilService.getMedia();
  }
}
