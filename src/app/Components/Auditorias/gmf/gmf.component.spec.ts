import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GMFComponent } from './gmf.component';

describe('GMFComponent', () => {
  let component: GMFComponent;
  let fixture: ComponentFixture<GMFComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ GMFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GMFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
