import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSuperAdminComponent } from './update-super-admin.component';

describe('UpdateSuperAdminComponent', () => {
  let component: UpdateSuperAdminComponent;
  let fixture: ComponentFixture<UpdateSuperAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSuperAdminComponent]
    });
    fixture = TestBed.createComponent(UpdateSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
