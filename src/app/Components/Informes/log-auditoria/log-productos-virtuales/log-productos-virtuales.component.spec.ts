import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogProductosVirtualesComponent } from './log-productos-virtuales.component';

describe('LogProductosVirtualesComponent', () => {
  let component: LogProductosVirtualesComponent;
  let fixture: ComponentFixture<LogProductosVirtualesComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LogProductosVirtualesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogProductosVirtualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
