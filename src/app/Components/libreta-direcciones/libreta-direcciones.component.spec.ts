import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibretaDireccionesComponent } from './libreta-direcciones.component';

describe('LibretaDireccionesComponent', () => {
  let component: LibretaDireccionesComponent;
  let fixture: ComponentFixture<LibretaDireccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibretaDireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibretaDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
