import { TestBed } from '@angular/core/testing';

import { SharedRoleService } from './shared-role.service';

describe('SharedRoleService', () => {
  let service: SharedRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
