import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDigitComponent } from './single-digit.component';

describe('SingleDigitComponent', () => {
  let component: SingleDigitComponent;
  let fixture: ComponentFixture<SingleDigitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDigitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDigitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
