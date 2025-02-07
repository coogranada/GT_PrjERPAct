import {ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraTabComponent } from './cartera-tab.component';

describe('CarteraTabComponent', () => {
  let component: CarteraTabComponent;
  let fixture: ComponentFixture<CarteraTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
