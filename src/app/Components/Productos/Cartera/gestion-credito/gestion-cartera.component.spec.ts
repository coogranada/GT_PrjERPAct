import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionCarteraComponent } from './gestion-cartera.component';



describe('GestionCarteraComponent', () => {
  let component: GestionCarteraComponent;
  let fixture: ComponentFixture<GestionCarteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCarteraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
