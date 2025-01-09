import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoJuridicosComponent } from './info-juridicos.component';

describe('InfoJuridicosComponent', () => {
  let component: InfoJuridicosComponent;
  let fixture: ComponentFixture<InfoJuridicosComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ InfoJuridicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoJuridicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
