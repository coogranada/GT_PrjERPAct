import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSesionesComponent } from './control-sesiones.component';

describe('ControlSesionesComponent', () => {
  let component: ControlSesionesComponent;
  let fixture: ComponentFixture<ControlSesionesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ControlSesionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
