import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoCambioCuentaDestinoComponent } from './formato-cambio-cuentadestino.component';

describe('FormatoCambioCuentaDestinoComponent', () => {
  let component: FormatoCambioCuentaDestinoComponent;
  let fixture: ComponentFixture<FormatoCambioCuentaDestinoComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoCambioCuentaDestinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoCambioCuentaDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
