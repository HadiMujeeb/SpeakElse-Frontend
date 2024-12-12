import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorWalletComponent } from './mentor-wallet.component';

describe('MentorWalletComponent', () => {
  let component: MentorWalletComponent;
  let fixture: ComponentFixture<MentorWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorWalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
