import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpMotorComponent } from './sp-motor.component';

describe('SpMotorComponent', () => {
  let component: SpMotorComponent;
  let fixture: ComponentFixture<SpMotorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpMotorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
