import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalesExternosComponent } from './canales-externos.component';

describe('CanalesExternosComponent', () => {
  let component: CanalesExternosComponent;
  let fixture: ComponentFixture<CanalesExternosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ CanalesExternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanalesExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
