import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicadosComponent } from './radicados.component';

describe('RadicadosComponent', () => {
  let component: RadicadosComponent;
  let fixture: ComponentFixture<RadicadosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ RadicadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
