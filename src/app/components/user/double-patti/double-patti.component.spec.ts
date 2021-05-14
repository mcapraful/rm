import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoublePattiComponent } from './double-patti.component';

describe('DoublePattiComponent', () => {
  let component: DoublePattiComponent;
  let fixture: ComponentFixture<DoublePattiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoublePattiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoublePattiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
