import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogGestionClientesComponent } from './log-gestion-clientes.component';

describe('LogGestionClientesComponent', () => {
  let component: LogGestionClientesComponent;
  let fixture: ComponentFixture<LogGestionClientesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LogGestionClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogGestionClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
