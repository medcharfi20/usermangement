import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetAdminComponent } from './forget-admin.component';

describe('ForgetAdminComponent', () => {
  let component: ForgetAdminComponent;
  let fixture: ComponentFixture<ForgetAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetAdminComponent]
    });
    fixture = TestBed.createComponent(ForgetAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
