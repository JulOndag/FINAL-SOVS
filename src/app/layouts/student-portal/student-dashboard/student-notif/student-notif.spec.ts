import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentNotif } from './student-notif';

describe('StudentNotif', () => {
  let component: StudentNotif;
  let fixture: ComponentFixture<StudentNotif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentNotif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentNotif);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
