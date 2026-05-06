import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentApply } from './student-apply';

describe('StudentApply', () => {
  let component: StudentApply;
  let fixture: ComponentFixture<StudentApply>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentApply]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentApply);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
