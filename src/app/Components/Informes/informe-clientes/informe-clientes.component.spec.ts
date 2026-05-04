import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeClientesComponent } from './informe-clientes.component';

describe('InformeClientesComponent', () => {
  let component: InformeClientesComponent;
  let fixture: ComponentFixture<InformeClientesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ InformeClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
