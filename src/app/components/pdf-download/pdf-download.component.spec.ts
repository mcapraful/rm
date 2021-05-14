import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfExcelDownloadComponent } from './pdf-download.component';

describe('PdfExcelDownloadComponent', () => {
  let component: PdfExcelDownloadComponent;
  let fixture: ComponentFixture<PdfExcelDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PdfExcelDownloadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfExcelDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
