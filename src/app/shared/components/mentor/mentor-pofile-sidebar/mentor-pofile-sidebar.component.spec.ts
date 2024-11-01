import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPofileSidebarComponent } from './mentor-pofile-sidebar.component';

describe('MentorPofileSidebarComponent', () => {
  let component: MentorPofileSidebarComponent;
  let fixture: ComponentFixture<MentorPofileSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorPofileSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorPofileSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
