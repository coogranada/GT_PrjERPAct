import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposicionPortafolioComponent } from './composicion-portafolio.component';

describe('ComposicionPortafolioComponent', () => {
  let component: ComposicionPortafolioComponent;
  let fixture: ComponentFixture<ComposicionPortafolioComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ComposicionPortafolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposicionPortafolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
