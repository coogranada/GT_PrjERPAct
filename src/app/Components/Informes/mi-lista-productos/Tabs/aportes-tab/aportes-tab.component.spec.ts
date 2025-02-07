import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AportesTabComponent } from './aportes-tab.component';

describe('AportesTabComponent', () => {
  let component: AportesTabComponent;
  let fixture: ComponentFixture<AportesTabComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ AportesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AportesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
