import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPasswordComponent } from './master-password.component';

describe('MasterPasswordComponent', () => {
  let component: MasterPasswordComponent;
  let fixture: ComponentFixture<MasterPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
