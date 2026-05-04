import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeAhorrosComponent } from './informe-ahorros.component';

describe('InformeAhorrosComponent', () => {
  let component: InformeAhorrosComponent;
  let fixture: ComponentFixture<InformeAhorrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeAhorrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeAhorrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
