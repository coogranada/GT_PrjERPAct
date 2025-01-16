import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoAsesoriaComponent } from './formato-asesoria.component';

describe('FormatoAsesoriaComponent', () => {
  let component: FormatoAsesoriaComponent;
  let fixture: ComponentFixture<FormatoAsesoriaComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoAsesoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoAsesoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
