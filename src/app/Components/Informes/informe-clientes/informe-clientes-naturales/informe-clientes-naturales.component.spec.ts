import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeClientesNaturalesComponent } from './informe-clientes-naturales.component';

describe('InformeClientesNaturalesComponent', () => {
  let component: InformeClientesNaturalesComponent;
  let fixture: ComponentFixture<InformeClientesNaturalesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ InformeClientesNaturalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeClientesNaturalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
