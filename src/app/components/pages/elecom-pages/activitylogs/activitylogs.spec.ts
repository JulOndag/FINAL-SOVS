import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activitylogs } from './activitylogs';

describe('Activitylogs', () => {
  let component: Activitylogs;
  let fixture: ComponentFixture<Activitylogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activitylogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Activitylogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
