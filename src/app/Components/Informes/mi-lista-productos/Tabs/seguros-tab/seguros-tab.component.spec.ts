import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegurosTabComponent } from './seguros-tab.component';

describe('SegurosTabComponent', () => {
  let component: SegurosTabComponent;
  let fixture: ComponentFixture<SegurosTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ SegurosTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegurosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
