import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { genaralReportTableMapping } from './general-report-table-mapping';
import { generalReportTableRows } from './general-report-table-data';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.css'],
})
export class GeneralReportComponent implements OnInit {
  tableColumns = [];
  tableRows = [];
  reportType = ['Credit Reference Report', 'Test Report', 'Dummy Report'];
  generalReportForm: FormGroup;
  totalRecords;
  constructor() {}

  ngOnInit(): void {
    this.initGeneralReportForm();
    this.getTableColumns();
    this.getTableRows();
  }

  initGeneralReportForm() {
    this.generalReportForm = new FormGroup({
      reportType: new FormControl(''),
    });
  }

  getTableColumns() {
    this.tableColumns = genaralReportTableMapping;
  }

  getTableRows() {
    this.tableRows = generalReportTableRows;
    this.totalRecords = this.tableRows.length;
  }

  onFormSubmit() {}
}
