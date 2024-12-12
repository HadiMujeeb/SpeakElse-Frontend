import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorsSesstionsComponent } from './mentors-sesstions.component';

describe('MentorsSesstionsComponent', () => {
  let component: MentorsSesstionsComponent;
  let fixture: ComponentFixture<MentorsSesstionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorsSesstionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorsSesstionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
