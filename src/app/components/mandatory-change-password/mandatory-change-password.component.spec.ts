import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryChangePasswordComponent } from './mandatory-change-password.component';

describe('MandatoryChangePasswordComponent', () => {
  let component: MandatoryChangePasswordComponent;
  let fixture: ComponentFixture<MandatoryChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
