import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeningTaskComponent } from './listening-task.component';

describe('ListeningTaskComponent', () => {
  let component: ListeningTaskComponent;
  let fixture: ComponentFixture<ListeningTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeningTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeningTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
