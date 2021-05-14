import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedBracketComponent } from './red-bracket.component';

describe('RedBracketComponent', () => {
  let component: RedBracketComponent;
  let fixture: ComponentFixture<RedBracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedBracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
