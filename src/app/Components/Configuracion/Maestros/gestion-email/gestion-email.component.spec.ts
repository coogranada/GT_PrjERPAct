import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GestionEmail } from "./gestion-email.component";

describe("GestionEmail", () => {
  let component: GestionEmail;
  let fixture: ComponentFixture<GestionEmail>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [GestionEmail],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
