import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesoriaTerminoComponent } from './asesoria-termino.component';

describe('AsesoriaTerminoComponent', () => {
  let component: AsesoriaTerminoComponent;
  let fixture: ComponentFixture<AsesoriaTerminoComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ AsesoriaTerminoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsesoriaTerminoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
