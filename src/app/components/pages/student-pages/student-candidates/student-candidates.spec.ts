import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCandidates } from './student-candidates';

describe('StudentCandidates', () => {
  let component: StudentCandidates;
  let fixture: ComponentFixture<StudentCandidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCandidates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCandidates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
