import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionesOperacionesComponent } from './gestiones-operaciones.component';

describe('GestionesOperacionesComponent', () => {
  let component: GestionesOperacionesComponent;
  let fixture: ComponentFixture<GestionesOperacionesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ GestionesOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionesOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
