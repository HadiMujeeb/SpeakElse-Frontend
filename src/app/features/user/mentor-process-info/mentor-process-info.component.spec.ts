import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorProcessInfoComponent } from './mentor-process-info.component';

describe('MentorProcessInfoComponent', () => {
  let component: MentorProcessInfoComponent;
  let fixture: ComponentFixture<MentorProcessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorProcessInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorProcessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
