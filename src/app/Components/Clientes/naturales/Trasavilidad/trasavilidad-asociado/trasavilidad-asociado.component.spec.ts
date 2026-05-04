import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasavilidadAsociadoComponent } from './trasavilidad-asociado.component';

describe('TrasavilidadAsociadoComponent', () => {
  let component: TrasavilidadAsociadoComponent;
  let fixture: ComponentFixture<TrasavilidadAsociadoComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ TrasavilidadAsociadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasavilidadAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
