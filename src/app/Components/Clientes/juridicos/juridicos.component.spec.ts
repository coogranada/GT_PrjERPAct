import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuridicosComponent } from './juridicos.component';

describe('JuridicosComponent', () => {
  let component: JuridicosComponent;
  let fixture: ComponentFixture<JuridicosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ JuridicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuridicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
