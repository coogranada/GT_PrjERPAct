import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsecutivoTituloComponent } from './consecutivo-titulo.component';

describe('ConsecutivoTituloComponent', () => {
  let component: ConsecutivoTituloComponent;
  let fixture: ComponentFixture<ConsecutivoTituloComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ConsecutivoTituloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsecutivoTituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
