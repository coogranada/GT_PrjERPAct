import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionInformesComponent } from './configuracion-informes.component';

describe('ConfiguracionInformesComponent', () => {
  let component: ConfiguracionInformesComponent;
  let fixture: ComponentFixture<ConfiguracionInformesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionInformesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
