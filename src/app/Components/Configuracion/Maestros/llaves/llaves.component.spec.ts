import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlavesComponent } from './llaves.component';

describe('LlavesComponent', () => {
  let component: LlavesComponent;
  let fixture: ComponentFixture<LlavesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LlavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
