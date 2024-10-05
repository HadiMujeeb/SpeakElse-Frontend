import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthHeaderComponent } from './ath-header.component';

describe('AthHeaderComponent', () => {
  let component: AthHeaderComponent;
  let fixture: ComponentFixture<AthHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
