import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogBannerComponent } from './log-banner.component';

describe('LogBannerComponent', () => {
  let component: LogBannerComponent;
  let fixture: ComponentFixture<LogBannerComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LogBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
