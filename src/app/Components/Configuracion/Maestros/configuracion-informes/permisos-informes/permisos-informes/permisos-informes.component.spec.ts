import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisosInformesComponent } from './permisos-informes.component';

describe('PermisosInformesComponent', () => {
  let component: PermisosInformesComponent;
  let fixture: ComponentFixture<PermisosInformesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisosInformesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisosInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
