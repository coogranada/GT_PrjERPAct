import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresGerencialesComponent } from './indicadores-gerenciales.component';

describe('IndicadoresGerencialesComponent', () => {
  let component: IndicadoresGerencialesComponent;
  let fixture: ComponentFixture<IndicadoresGerencialesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresGerencialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresGerencialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
