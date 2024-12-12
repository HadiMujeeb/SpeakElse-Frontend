import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMainpageComponent } from './user-mainpage.component';

describe('UserMainpageComponent', () => {
  let component: UserMainpageComponent;
  let fixture: ComponentFixture<UserMainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMainpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
