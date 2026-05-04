import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransaccionesCajaComponent } from './transacciones-caja.component';

describe('TransaccionesCajaComponent', () => {
  let component: TransaccionesCajaComponent;
  let fixture: ComponentFixture<TransaccionesCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionesCajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransaccionesCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
