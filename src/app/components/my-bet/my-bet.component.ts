import { Component, OnInit } from '@angular/core';
import { myBetTableMapping } from './my-bet-report-table-mapping';

@Component({
  selector: 'app-my-bet',
  templateUrl: './my-bet.component.html',
  styleUrls: ['./my-bet.component.css']
})
export class MyBetComponent implements OnInit {
  tableColumns = [];
  constructor() {
    this.setTableColumns();
  }

  ngOnInit(): void {
  }

  setTableColumns() {
    this.tableColumns = myBetTableMapping;
  }

}
