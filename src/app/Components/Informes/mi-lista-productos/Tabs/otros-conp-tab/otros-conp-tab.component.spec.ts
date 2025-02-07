import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosConpTabComponent } from './otros-conp-tab.component';

describe('OtrosConpTabComponent', () => {
  let component: OtrosConpTabComponent;
  let fixture: ComponentFixture<OtrosConpTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ OtrosConpTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosConpTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
