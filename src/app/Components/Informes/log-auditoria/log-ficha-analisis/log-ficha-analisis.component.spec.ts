import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogFichaAnalisisComponent } from './log-ficha-analisis.component';

describe('LogFichaAnalisisComponent', () => {
  let component: LogFichaAnalisisComponent;
  let fixture: ComponentFixture<LogFichaAnalisisComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LogFichaAnalisisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogFichaAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
