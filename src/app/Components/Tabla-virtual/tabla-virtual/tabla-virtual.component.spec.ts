import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaVirtualComponent } from './tabla-virtual.component';

describe('TablaVirtualComponent', () => {
  let component: TablaVirtualComponent;
  let fixture: ComponentFixture<TablaVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaVirtualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
