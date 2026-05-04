import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionesModulosComponent } from './operaciones-modulos.component';

describe('OperacionesModulosComponent', () => {
  let component: OperacionesModulosComponent;
  let fixture: ComponentFixture<OperacionesModulosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ OperacionesModulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacionesModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
