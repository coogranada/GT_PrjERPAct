import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicacionesColaborativasComponent } from './aplicaciones-colaborativas.component';

describe('AplicacionesColaborativasComponent', () => {
  let component: AplicacionesColaborativasComponent;
  let fixture: ComponentFixture<AplicacionesColaborativasComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ AplicacionesColaborativasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplicacionesColaborativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
