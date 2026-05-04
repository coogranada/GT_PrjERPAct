import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudServiciosJuridicosComponent } from './solicitud-servicios-juridicos.component';

describe('SolicitudServiciosJuridicosComponent', () => {
  let component: SolicitudServiciosJuridicosComponent;
  let fixture: ComponentFixture<SolicitudServiciosJuridicosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudServiciosJuridicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudServiciosJuridicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
