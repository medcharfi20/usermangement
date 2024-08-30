import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetUserComponent } from './forget-user.component';

describe('ForgetUserComponent', () => {
  let component: ForgetUserComponent;
  let fixture: ComponentFixture<ForgetUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetUserComponent]
    });
    fixture = TestBed.createComponent(ForgetUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
