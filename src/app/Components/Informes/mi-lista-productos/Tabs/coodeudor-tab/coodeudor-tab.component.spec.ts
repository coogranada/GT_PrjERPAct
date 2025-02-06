import {  ComponentFixture, TestBed } from '@angular/core/testing';

import { CoodeudorTabComponent } from './coodeudor-tab.component';

describe('CoodeudorTabComponent', () => {
  let component: CoodeudorTabComponent;
  let fixture: ComponentFixture<CoodeudorTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ CoodeudorTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoodeudorTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
