import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorProfileComponent } from './mentor-profile.component';

describe('MentorProfileComponent', () => {
  let component: MentorProfileComponent;
  let fixture: ComponentFixture<MentorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
