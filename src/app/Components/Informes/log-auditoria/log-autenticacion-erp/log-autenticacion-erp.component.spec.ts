import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAutenticacionErpComponent } from './log-autenticacion-erp.component';

describe('LogAutenticacionErpComponent', () => {
  let component: LogAutenticacionErpComponent;
  let fixture: ComponentFixture<LogAutenticacionErpComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LogAutenticacionErpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogAutenticacionErpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
