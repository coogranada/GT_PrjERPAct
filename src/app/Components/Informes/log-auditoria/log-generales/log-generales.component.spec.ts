import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogLogGeneralesComponent } from './log-generales.component';

describe('LogLogGeneralesComponent', () => {
  let component: LogLogGeneralesComponent;
  let fixture: ComponentFixture<LogLogGeneralesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LogLogGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogLogGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
