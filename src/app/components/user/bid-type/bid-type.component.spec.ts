import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidTypeComponent } from './bid-type.component';

describe('BidTypeComponent', () => {
  let component: BidTypeComponent;
  let fixture: ComponentFixture<BidTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
