import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-apply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-apply.html',
  styleUrls: ['./student-apply.scss']
})
export class StudentApply {

  parties: string[] = [
    'UNITY',
    'PROGRESSIVE ALLIANCE',
    'STUDENT FIRST',
    'LEADERSHIP PARTY',
    'INDEPENDENT'
  ];

  courses: string[] = ['BSIT', 'TCM', 'EMT'];

  positions: string[] = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Auditor'
  ];

  years: number[] = [1, 2, 3];

  form: any = this.resetForm();

  resetForm() {
    return {
      name: '',
      party: null,
      position: null,
      course: null,
      year: null,
      bio: '',
      status: 'pending',
      requirements: {
        enrollment: false,
        goodMoral: false,
        residency: false,
        coc: false,
        noViolations: false,
        noFailingGrades: false
      }
    };
  }

  submitApplication() {
    if (!this.form.name || !this.form.position || !this.form.course) {
      alert('Please fill required fields');
      return;
    }

    console.log(this.form);
    alert('Application submitted!');
    this.form = this.resetForm();
  }
}