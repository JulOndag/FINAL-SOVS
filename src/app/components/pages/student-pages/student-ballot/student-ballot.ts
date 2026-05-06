import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectionService, Election, Voter, Candidate } from '../../../../services/election';
import { AuthService } from '../../../../services/auth';
import { FormsModule } from '@angular/forms';

export interface BallotPosition {
  name: string;
  candidates: Candidate[];
}

@Component({
  selector: 'app-student-ballot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-ballot.html',
  styleUrl: './student-ballot.scss',
})
export class StudentBallot implements OnInit {
  election: Election | null = null;
  positions: BallotPosition[] = [];
  voter: Voter | null = null;
  votes: Record<string, string> = {};
  loading = true;
  submitting = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: ElectionService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const user = this.auth.getCurrentUser();

    if (!id || !user) {
      this.loading = false;
      return;
    }

    const numericId = Number(id);

    // Load all elections then find by id (both are number — no type mismatch)
    this.svc.getElections().subscribe((elections: Election[]) => {
      this.election = elections.find((e) => e.id === numericId) ?? null;
    });

    // Load voter status by student id
    this.svc.getVoterByStudentId(user.email).subscribe((voters: Voter[]) => {
      this.voter = voters[0] ?? null;
    });

    // Load approved candidates and group by position
    this.svc.getCandidates().subscribe((candidates: Candidate[]) => {
      const approved = candidates.filter((c) => c.status === 'approved');
      const positionMap = new Map<string, Candidate[]>();

      approved.forEach((c) => {
        if (!positionMap.has(c.position)) positionMap.set(c.position, []);
        positionMap.get(c.position)!.push(c);
      });

      this.positions = Array.from(positionMap.entries()).map(([name, cands]) => ({
        name,
        candidates: cands,
      }));

      this.loading = false;
    });
  }

  get hasVoted(): boolean {
    return this.voter?.hasVoted ?? false;
  }

  get totalPositions(): number {
    return this.positions.length;
  }

  get answeredCount(): number {
    return Object.keys(this.votes).length;
  }

  get progressPercent(): number {
    return this.totalPositions ? (this.answeredCount / this.totalPositions) * 100 : 0;
  }

  get allAnswered(): boolean {
    return this.answeredCount === this.totalPositions && this.totalPositions > 0;
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  }

  selectCandidate(position: string, candidateId: string): void {
    if (this.hasVoted || this.submitted) return;
    if (this.votes[position] === candidateId) {
      const updated = { ...this.votes };
      delete updated[position];
      this.votes = updated;
    } else {
      this.votes = { ...this.votes, [position]: candidateId };
    }
  }

  isSelected(position: string, candidateId: string): boolean {
    return this.votes[position] === candidateId;
  }

  submitBallot(): void {
    if (!this.allAnswered || !this.election || !this.voter) return;
    this.submitting = true;

    const candidateList: Candidate[] = this.positions.flatMap((p) => p.candidates);

    this.svc.castVote(this.voter, this.election, this.votes, candidateList).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        if (this.voter) this.voter = { ...this.voter, hasVoted: true };
      },
      error: () => {
        this.submitting = false;
        alert('Something went wrong. Please try again.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/student-elections']);
  }

  goToResults(): void {
    this.router.navigate(['/student-results']);
  }
}