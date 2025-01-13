import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractualComponent } from './contractual.component';

describe('ContractualComponent', () => {
  let component: ContractualComponent;
  let fixture: ComponentFixture<ContractualComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ContractualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
