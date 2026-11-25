import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidarInformesComponent } from './consolidar-informes.component';

describe('ConsolidarInformesComponent', () => {
  let component: ConsolidarInformesComponent;
  let fixture: ComponentFixture<ConsolidarInformesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidarInformesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidarInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
