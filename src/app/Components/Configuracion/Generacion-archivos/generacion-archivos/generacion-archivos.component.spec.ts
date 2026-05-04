import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionArchivosComponent } from './generacion-archivos.component';

describe('GeneracionArchivosComponent', () => {
  let component: GeneracionArchivosComponent;
  let fixture: ComponentFixture<GeneracionArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneracionArchivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneracionArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
