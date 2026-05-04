import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirTransaccionComponent } from './imprimir-transaccion.component';

describe('ImprimirTransaccionComponent', () => {
  let component: ImprimirTransaccionComponent;
  let fixture: ComponentFixture<ImprimirTransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprimirTransaccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprimirTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
