import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicadoDetalleComponent } from './radicado-detalle.component';

describe('RadicadoDetalleComponent', () => {
  let component: RadicadoDetalleComponent;
  let fixture: ComponentFixture<RadicadoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadicadoDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadicadoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
