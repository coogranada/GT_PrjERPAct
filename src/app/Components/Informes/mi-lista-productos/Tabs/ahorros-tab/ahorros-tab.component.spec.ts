import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhorrosTabComponent } from './ahorros-tab.component';

describe('AhorrosTabComponent', () => {
  let component: AhorrosTabComponent;
  let fixture: ComponentFixture<AhorrosTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ AhorrosTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhorrosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
