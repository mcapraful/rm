import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { PageModel } from 'src/app/shared/page-model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent implements OnInit {
  page = new PageModel();
  columnMode = '';
  @Input() rows: any;
  @Input() columns: any;
  @Input() totalRecordsCount: number;
  @Output() rowClicked: EventEmitter<any> = new EventEmitter();
  @Output() actionClicked: EventEmitter<any> = new EventEmitter();
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('actions', { static: true }) actions: any;
  ColumnMode = ColumnMode;

  constructor() {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    console.log(this.rows);
    console.log(this.columns);
    this.columns.forEach((column) => {
      if (column.width) {
        this.columnMode = 'force';
      } else {
        this.columnMode = 'flex';
      }
      if (column.fieldName === 'actions') {
        column.cellTemplate = this.actions;
      }
    });
  }

  ngOnChanges() {
    this.page.totalElements = this.totalRecordsCount;
    this.page.totalPages = Math.ceil(this.totalRecordsCount / this.page.size);
  }

  findClassName(iconClassMap, column, row) {
    const classFound = iconClassMap.find((class1) => {
      if (
        row.hasOwnProperty(column.fieldName) &&
        row[column.fieldName] === class1.value
      ) {
        return class1;
      }
    });
    return classFound ? classFound.class : null;
  }

  onRowClicked($event) {
    if ($event.type === 'click') {
      this.rowClicked.emit($event);
    }
  }

  onActionClick(row: any, action: string) {
    const data = {
      userData: row,
      action: action,
    };
    this.actionClicked.emit(data);
  }

  getCellClass = ({ row, column, value }): any => {
    return {
      'cell-color': true,
    };
  };

  setPage(event) {
    this.pageEvent.emit(event);
  }
}
