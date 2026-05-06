import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBallot } from './student-ballot';

describe('StudentBallot', () => {
  let component: StudentBallot;
  let fixture: ComponentFixture<StudentBallot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentBallot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentBallot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
