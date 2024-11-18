import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantVideoComponent } from './participant-video.component';

describe('ParticipantVideoComponent', () => {
  let component: ParticipantVideoComponent;
  let fixture: ComponentFixture<ParticipantVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
