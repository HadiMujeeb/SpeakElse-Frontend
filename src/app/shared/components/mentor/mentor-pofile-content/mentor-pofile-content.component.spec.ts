import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPofileContentComponent } from './mentor-pofile-content.component';

describe('MentorPofileContentComponent', () => {
  let component: MentorPofileContentComponent;
  let fixture: ComponentFixture<MentorPofileContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorPofileContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorPofileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
