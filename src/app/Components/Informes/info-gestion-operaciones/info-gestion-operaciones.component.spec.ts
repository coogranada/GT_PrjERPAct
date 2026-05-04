import {ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGestionOperacionesComponent } from './info-gestion-operaciones.component';

describe('InfoGestionOperacionesComponent', () => {
  let component: InfoGestionOperacionesComponent;
  let fixture: ComponentFixture<InfoGestionOperacionesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ InfoGestionOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGestionOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
