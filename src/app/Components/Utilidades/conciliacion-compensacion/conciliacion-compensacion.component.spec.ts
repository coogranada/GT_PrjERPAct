import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliacionCompensacionComponent } from './conciliacion-compensacion.component';

describe('ConciliacionCompensacionComponent', () => {
  let component: ConciliacionCompensacionComponent;
  let fixture: ComponentFixture<ConciliacionCompensacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConciliacionCompensacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConciliacionCompensacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
