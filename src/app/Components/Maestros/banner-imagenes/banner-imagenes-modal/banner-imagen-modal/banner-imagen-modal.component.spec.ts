import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerImagenModalComponent } from './banner-imagen-modal.component';

describe('BannerImagenModalComponent', () => {
  let component: BannerImagenModalComponent;
  let fixture: ComponentFixture<BannerImagenModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerImagenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerImagenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
