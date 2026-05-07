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

  Math = Math;

  currentStep = 1;
  submittedData: any = null;

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
    'Auditor',
    'PRO / PIO',
    'Senator'
  ];

  years: number[] = [1, 2, 3, 4];

  form: any = this.blankForm();

  blankForm() {
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

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  reqCount(): number {
    return Object.values(this.form.requirements).filter(Boolean).length;
  }

  nextStep(): void {
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  submitApplication(): void {
    if (!this.form.name || !this.form.position || !this.form.course) {
      alert('Please fill in all required fields.');
      return;
    }

    // Snapshot the form data for the confirmation step
    this.submittedData = {
      ...this.form,
      reqCount: this.reqCount()
    };

    console.log('Application submitted:', this.submittedData);

    // Advance to Step 4 — the locked confirmation step
    this.currentStep = 4;
  }
}