import {  ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesTabComponent } from './notificaciones-tab.component';

describe('NotificacionesTabComponent', () => {
  let component: NotificacionesTabComponent;
  let fixture: ComponentFixture<NotificacionesTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
