import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JodiComponent } from './jodi.component';

describe('JodiComponent', () => {
  let component: JodiComponent;
  let fixture: ComponentFixture<JodiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JodiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JodiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
