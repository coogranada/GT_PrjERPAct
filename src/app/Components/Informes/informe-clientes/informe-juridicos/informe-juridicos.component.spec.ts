import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeJuridicosComponent } from './informe-juridicos.component';

describe('InformeJuridicosComponent', () => {
  let component: InformeJuridicosComponent;
  let fixture: ComponentFixture<InformeJuridicosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ InformeJuridicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeJuridicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
