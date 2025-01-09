import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesGestionesComponent } from './solicitudes-gestiones.component';

describe('SolicitudesGestionesComponent', () => {
  let component: SolicitudesGestionesComponent;
  let fixture: ComponentFixture<SolicitudesGestionesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesGestionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesGestionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
