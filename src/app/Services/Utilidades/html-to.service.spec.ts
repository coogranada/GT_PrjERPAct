import { TestBed } from '@angular/core/testing';

import { HtmlToService } from './html-to.service';

describe('HtmlToService', () => {
  let service: HtmlToService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlToService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
