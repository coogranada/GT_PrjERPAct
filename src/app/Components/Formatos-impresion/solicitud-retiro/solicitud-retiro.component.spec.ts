import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudRetiroComponent } from './solicitud-retiro.component';

describe('SolicitudRetiroComponent', () => {
  let component: SolicitudRetiroComponent;
  let fixture: ComponentFixture<SolicitudRetiroComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudRetiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudRetiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
