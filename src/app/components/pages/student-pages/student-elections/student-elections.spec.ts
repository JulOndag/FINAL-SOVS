import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentElections } from './student-elections';

describe('StudentElections', () => {
  let component: StudentElections;
  let fixture: ComponentFixture<StudentElections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentElections]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentElections);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
