import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilidadesTabComponent } from './utilidades-tab.component';

describe('UtilidadesTabComponent', () => {
  let component: UtilidadesTabComponent;
  let fixture: ComponentFixture<UtilidadesTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ UtilidadesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilidadesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
