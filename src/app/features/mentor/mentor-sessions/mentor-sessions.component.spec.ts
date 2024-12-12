import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorSessionsComponent } from './mentor-sessions.component';

describe('MentorSessionsComponent', () => {
  let component: MentorSessionsComponent;
  let fixture: ComponentFixture<MentorSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
