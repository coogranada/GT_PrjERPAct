import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCreditoComponent } from './gestion-credito.component';

describe('GestionCreditoComponent', () => {
  let component: GestionCreditoComponent;
  let fixture: ComponentFixture<GestionCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCreditoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
