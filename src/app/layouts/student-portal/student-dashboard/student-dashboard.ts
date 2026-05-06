import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { ElectionService, Election, Voter, Application } from '../../../services/election';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit {
  elections: Election[] = [];
  voter: Voter | null = null;
  application: Application | null = null;
  loading = true;

  constructor(
    public auth: AuthService,
    private svc: ElectionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.loading = false;
      return;
    }

    this.svc.getElections().subscribe((elections) => {
      this.elections = elections;
    });

    this.svc.getVoterByStudentId(user.email).subscribe((voters: Voter[]) => {
      this.voter = voters[0] || null;
    });

    this.svc.getApplicationByStudentId(user.email).subscribe((apps: Application[]) => {
      this.application = apps[0] || null;
      this.loading = false;
    });
  }

  get activeElections(): Election[] {
    return this.elections.filter((e) => e.status === 'active');
  }
  get upcomingElections(): Election[] {
    return this.elections.filter((e) => e.status === 'upcoming');
  }
  get isRegistered(): boolean {
    return !!this.voter;
  }
  get hasVoted(): boolean {
    return this.voter?.hasVoted ?? false;
  }

  goToVote(election: Election): void {
    this.router.navigate(['/student-ballot', election.id]);
  }
  goToElections(): void {
    this.router.navigate(['/student-elections']);
  }
  goToApply(): void {
    this.router.navigate(['/student-apply']);
  }
  goToResults(): void {
    this.router.navigate(['/student-results']);
  }
}
