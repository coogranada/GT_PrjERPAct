import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogRecaudoOlivosComponent } from './log-recaudo-olivos.component';

describe('LogRecaudoOlivosComponent', () => {
  let component: LogRecaudoOlivosComponent;
  let fixture: ComponentFixture<LogRecaudoOlivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogRecaudoOlivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogRecaudoOlivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
