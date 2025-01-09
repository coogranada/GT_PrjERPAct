import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBannerComponent } from './gestion-banner.component';

describe('GestionBannerComponent', () => {
  let component: GestionBannerComponent;
  let fixture: ComponentFixture<GestionBannerComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ GestionBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
