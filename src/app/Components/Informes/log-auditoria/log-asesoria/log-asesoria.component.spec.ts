import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAsesoriaComponent } from './log-asesoria.component';

describe('LogAsesoriaComponent', () => {
  let component: LogAsesoriaComponent;
  let fixture: ComponentFixture<LogAsesoriaComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LogAsesoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogAsesoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
