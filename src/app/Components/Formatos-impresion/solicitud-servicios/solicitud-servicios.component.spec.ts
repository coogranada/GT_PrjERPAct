import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudServiciosComponent } from './solicitud-servicios.component';

describe('SolicitudServiciosComponent', () => {
  let component: SolicitudServiciosComponent;
  let fixture: ComponentFixture<SolicitudServiciosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
