import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ElectionService, Election, Voter, Candidate } from '../../../../services/election';
import { AuthService } from '../../../../services/auth';
import { FormsModule } from '@angular/forms';

export interface BallotPosition {
  name: string;
  candidates: Candidate[];
}

type BallotView = 'select-election' | 'ballot' | 'success';

@Component({
  selector: 'app-student-ballot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-ballot.html',
  styleUrl: './student-ballot.scss',
})
export class StudentBallot implements OnInit {
  // Election selection state
  elections: Election[] = [];
  selectedElection: Election | null = null;

  // Ballot state
  positions: BallotPosition[] = [];
  voter: Voter | null = null;
  votes: Record<string, string> = {};

  // UI state
  view: BallotView = 'select-election';
  loading = true;
  ballotLoading = false;
  submitting = false;

  constructor(
    private router: Router,
    private svc: ElectionService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();

    // Load voter status
    if (user) {
      this.svc.getVoterByStudentId(user.email).subscribe((voters: Voter[]) => {
        this.voter = voters[0] ?? null;
      });
    }

    // Load active elections
    this.svc.getElections().subscribe((elections: Election[]) => {
      // Show active elections only on ballot page
      this.elections = elections.filter((e) => e.status === 'active');
      this.loading = false;
    });
  }

  // ── Election selection ──────────────────────────────────────────────

  selectElection(election: Election): void {
    this.selectedElection = election;
    this.votes = {};
    this.view = 'ballot';
    this.ballotLoading = true;

    this.svc.getCandidates().subscribe((candidates: Candidate[]) => {
      const approved = candidates.filter(
        (c) => c.status === 'approved'
      );
      const positionMap = new Map<string, Candidate[]>();

      approved.forEach((c) => {
        if (!positionMap.has(c.position)) positionMap.set(c.position, []);
        positionMap.get(c.position)!.push(c);
      });

      this.positions = Array.from(positionMap.entries()).map(([name, cands]) => ({
        name,
        candidates: cands,
      }));

      this.ballotLoading = false;
    });
  }

  backToSelection(): void {
    this.selectedElection = null;
    this.positions = [];
    this.votes = {};
    this.view = 'select-election';
  }

  // ── Ballot logic ────────────────────────────────────────────────────

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
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  selectCandidate(position: string, candidateId: string): void {
    if (this.hasVoted || this.view === 'success') return;
    if (this.votes[position] === candidateId) {
      const updated = { ...this.votes };
      delete updated[position];
      this.votes = updated;
    } else {
      this.votes = { ...this.votes, [position]: candidateId };
    }
  }

  submitBallot(): void {
    if (!this.allAnswered || !this.selectedElection || !this.voter) return;
    this.submitting = true;

    const candidateList: Candidate[] = this.positions.flatMap((p) => p.candidates);

    this.svc
      .castVote(this.voter, this.selectedElection, this.votes, candidateList)
      .subscribe({
        next: () => {
          this.submitting = false;
          if (this.voter) this.voter = { ...this.voter, hasVoted: true };
          this.view = 'success';
        },
        error: () => {
          this.submitting = false;
          alert('Something went wrong. Please try again.');
        },
      });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      active: 'Active',
      upcoming: 'Upcoming',
      completed: 'Completed',
    };
    return map[status] ?? status;
  }

  goToResults(): void {
    this.router.navigate(['/app/student-results']);
  }

  goHome(): void {
    this.router.navigate(['/app/student-elections']);
  }
}