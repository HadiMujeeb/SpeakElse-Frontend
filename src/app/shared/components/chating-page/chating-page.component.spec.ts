import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatingPageComponent } from './chating-page.component';

describe('ChatingPageComponent', () => {
  let component: ChatingPageComponent;
  let fixture: ComponentFixture<ChatingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
