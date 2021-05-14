import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePattiComponent } from './single-patti.component';

describe('SinglePattiComponent', () => {
  let component: SinglePattiComponent;
  let fixture: ComponentFixture<SinglePattiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglePattiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePattiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
