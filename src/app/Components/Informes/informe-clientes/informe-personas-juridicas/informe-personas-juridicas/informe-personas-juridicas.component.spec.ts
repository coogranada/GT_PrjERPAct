import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformePersonasJuridicasComponent } from './informe-personas-juridicas.component';

describe('InformePersonasJuridicasComponent', () => {
  let component: InformePersonasJuridicasComponent;
  let fixture: ComponentFixture<InformePersonasJuridicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformePersonasJuridicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformePersonasJuridicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
