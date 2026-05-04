import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatacreditoComponent } from './datacredito.component';

describe('DatacreditoComponent', () => {
  let component: DatacreditoComponent;
  let fixture: ComponentFixture<DatacreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatacreditoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatacreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
