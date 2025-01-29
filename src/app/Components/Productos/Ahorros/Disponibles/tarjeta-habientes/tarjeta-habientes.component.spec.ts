import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaHabientesComponent } from './tarjeta-habientes.component';

describe('TarjetaHabientesComponent', () => {
  let component: TarjetaHabientesComponent;
  let fixture: ComponentFixture<TarjetaHabientesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaHabientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaHabientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
