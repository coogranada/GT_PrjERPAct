import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAnalisisComponent } from './ficha-analisis.component';

describe('FichaAnalisisComponent', () => {
  let component: FichaAnalisisComponent;
  let fixture: ComponentFixture<FichaAnalisisComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [FichaAnalisisComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
