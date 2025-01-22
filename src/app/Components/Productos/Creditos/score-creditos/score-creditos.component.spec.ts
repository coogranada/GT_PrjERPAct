import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCreditosComponent } from './score-creditos.component';

describe('ScoreCreditosComponent', () => {
  let component: ScoreCreditosComponent;
  let fixture: ComponentFixture<ScoreCreditosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreCreditosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
