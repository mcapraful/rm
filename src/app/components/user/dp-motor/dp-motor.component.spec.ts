import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpMotorComponent } from './dp-motor.component';

describe('DpMotorComponent', () => {
  let component: DpMotorComponent;
  let fixture: ComponentFixture<DpMotorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpMotorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
