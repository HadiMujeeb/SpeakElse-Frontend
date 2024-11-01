import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorapplicationComponent } from './mentorapplication.component';

describe('MentorapplicationComponent', () => {
  let component: MentorapplicationComponent;
  let fixture: ComponentFixture<MentorapplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorapplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
