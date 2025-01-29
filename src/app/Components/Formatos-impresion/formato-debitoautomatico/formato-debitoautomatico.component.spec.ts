import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoDebitoAutomaticoComponent } from './formato-debitoautomatico.component';

describe('FormatoDebitoAutomaticoComponent', () => {
  let component: FormatoDebitoAutomaticoComponent;
  let fixture: ComponentFixture<FormatoDebitoAutomaticoComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoDebitoAutomaticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoDebitoAutomaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
