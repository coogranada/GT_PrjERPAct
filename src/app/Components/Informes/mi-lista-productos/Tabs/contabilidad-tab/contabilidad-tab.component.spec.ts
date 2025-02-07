import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilidadTabComponent } from './contabilidad-tab.component';

describe('ContabilidadTabComponent', () => {
  let component: ContabilidadTabComponent;
  let fixture: ComponentFixture<ContabilidadTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilidadTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilidadTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
