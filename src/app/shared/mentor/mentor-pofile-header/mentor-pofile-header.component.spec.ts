import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPofileHeaderComponent } from './mentor-pofile-header.component';

describe('MentorPofileHeaderComponent', () => {
  let component: MentorPofileHeaderComponent;
  let fixture: ComponentFixture<MentorPofileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorPofileHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorPofileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
