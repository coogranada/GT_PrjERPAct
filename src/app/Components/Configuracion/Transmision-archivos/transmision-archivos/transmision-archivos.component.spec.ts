import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmisionArchivosComponent } from './transmision-archivos.component';

describe('TransmisionArchivosComponent', () => {
  let component: TransmisionArchivosComponent;
  let fixture: ComponentFixture<TransmisionArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransmisionArchivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransmisionArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
