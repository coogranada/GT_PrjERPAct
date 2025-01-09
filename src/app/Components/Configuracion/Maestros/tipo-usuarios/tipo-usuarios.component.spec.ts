import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoUsuariosComponent } from './tipo-usuarios.component';

describe('TipoUsuariosComponent', () => {
  let component: TipoUsuariosComponent;
  let fixture: ComponentFixture<TipoUsuariosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ TipoUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
