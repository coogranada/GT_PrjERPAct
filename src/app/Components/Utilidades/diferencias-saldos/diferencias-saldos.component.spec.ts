import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiferenciasSaldosComponent } from './diferencias-saldos.component';

describe('DiferenciasSaldosComponent', () => {
  let component: DiferenciasSaldosComponent;
  let fixture: ComponentFixture<DiferenciasSaldosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ DiferenciasSaldosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiferenciasSaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
