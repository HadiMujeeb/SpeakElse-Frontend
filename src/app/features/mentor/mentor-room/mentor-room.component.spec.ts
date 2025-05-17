import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorRoomComponent } from './mentor-room.component';

describe('MentorRoomComponent', () => {
  let component: MentorRoomComponent;
  let fixture: ComponentFixture<MentorRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
