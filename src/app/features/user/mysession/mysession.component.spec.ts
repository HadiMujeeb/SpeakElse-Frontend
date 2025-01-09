import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysessionComponent } from './mysession.component';

describe('MysessionComponent', () => {
  let component: MysessionComponent;
  let fixture: ComponentFixture<MysessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
