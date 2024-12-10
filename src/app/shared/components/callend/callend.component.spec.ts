import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallendComponent } from './callend.component';

describe('CallendComponent', () => {
  let component: CallendComponent;
  let fixture: ComponentFixture<CallendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
