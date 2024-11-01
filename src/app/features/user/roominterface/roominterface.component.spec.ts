import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoominterfaceComponent } from './roominterface.component';

describe('RoominterfaceComponent', () => {
  let component: RoominterfaceComponent;
  let fixture: ComponentFixture<RoominterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoominterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoominterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
