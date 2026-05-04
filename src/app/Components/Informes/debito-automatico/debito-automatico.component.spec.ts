import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitosAutomaticosComponent } from './debito-automatico.component';

describe('DebitosAutomaticosComponent', () => {
  let component: DebitosAutomaticosComponent;
  let fixture: ComponentFixture<DebitosAutomaticosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ DebitosAutomaticosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitosAutomaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
