import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvolucionOficinaComponent } from './evolucion-oficina.component';

describe('EvolucionOficinaComponent', () => {
  let component: EvolucionOficinaComponent;
  let fixture: ComponentFixture<EvolucionOficinaComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ EvolucionOficinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucionOficinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
