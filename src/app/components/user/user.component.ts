import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  // getEventData(eventName) {
  //   return this.bussinessInfoMap.get(eventName);
  // }
}
