import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriplePattiComponent } from './triple-patti.component';

describe('TriplePattiComponent', () => {
  let component: TriplePattiComponent;
  let fixture: ComponentFixture<TriplePattiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriplePattiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriplePattiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
