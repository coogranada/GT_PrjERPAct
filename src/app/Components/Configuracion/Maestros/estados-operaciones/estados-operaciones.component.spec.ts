import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosOperacionesComponent } from './estados-operaciones.component';

describe('EstadosOperacionesComponent', () => {
  let component: EstadosOperacionesComponent;
  let fixture: ComponentFixture<EstadosOperacionesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ EstadosOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
