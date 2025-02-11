import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMisProductosComponent } from './log-mis-productos.component';

describe('LogMisProductosComponent', () => {
  let component: LogMisProductosComponent;
  let fixture: ComponentFixture<LogMisProductosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LogMisProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogMisProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
