import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosProveedoresComponent } from './usuarios-proveedores.component';

describe('UsuariosProveedoresComponent', () => {
  let component: UsuariosProveedoresComponent;
  let fixture: ComponentFixture<UsuariosProveedoresComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosProveedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
