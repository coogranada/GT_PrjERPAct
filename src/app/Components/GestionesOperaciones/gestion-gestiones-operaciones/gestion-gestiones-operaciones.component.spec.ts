import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGestionesOperacionesComponent } from './gestion-gestiones-operaciones.component';

describe('GestionGestionesOperacionesComponent', () => {
  let component: GestionGestionesOperacionesComponent;
  let fixture: ComponentFixture<GestionGestionesOperacionesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ GestionGestionesOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionGestionesOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
