import { TestBed } from '@angular/core/testing';

import { PrerequisiteService } from './prerequisite.service';

describe('PrerequisiteService', () => {
  let service: PrerequisiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrerequisiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
