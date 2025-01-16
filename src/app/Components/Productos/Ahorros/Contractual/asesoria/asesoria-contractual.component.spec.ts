import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesoriaContractualComponent } from './asesoria-contractual.component';

describe('AsesoriaContractualComponent', () => {
  let component: AsesoriaContractualComponent;
  let fixture: ComponentFixture<AsesoriaContractualComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ AsesoriaContractualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsesoriaContractualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
