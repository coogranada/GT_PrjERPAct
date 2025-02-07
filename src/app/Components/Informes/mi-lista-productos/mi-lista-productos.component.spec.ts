import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiListaProductosComponent } from './mi-lista-productos.component';

describe('MiListaProductosComponent', () => {
  let component: MiListaProductosComponent;
  let fixture: ComponentFixture<MiListaProductosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ MiListaProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiListaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
