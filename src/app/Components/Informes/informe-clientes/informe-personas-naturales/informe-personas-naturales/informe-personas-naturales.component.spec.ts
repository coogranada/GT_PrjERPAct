import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformePersonasNaturalesComponent } from './informe-personas-naturales.component';

describe('InformePersonasNaturalesComponent', () => {
  let component: InformePersonasNaturalesComponent;
  let fixture: ComponentFixture<InformePersonasNaturalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformePersonasNaturalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformePersonasNaturalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
