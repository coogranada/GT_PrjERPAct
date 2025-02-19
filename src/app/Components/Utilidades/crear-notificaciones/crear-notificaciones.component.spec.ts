import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNotificacionesComponent } from './crear-notificaciones.component';

describe('CrearNotificacionesComponent', () => {
  let component: CrearNotificacionesComponent;
  let fixture: ComponentFixture<CrearNotificacionesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ CrearNotificacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
