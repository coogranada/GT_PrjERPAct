import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeConsecutivoTituloComponent } from './informe-consecutivo-titulo.component';

describe('InformeConsecutivoTituloComponent', () => {
  let component: InformeConsecutivoTituloComponent;
  let fixture: ComponentFixture<InformeConsecutivoTituloComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ InformeConsecutivoTituloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeConsecutivoTituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
