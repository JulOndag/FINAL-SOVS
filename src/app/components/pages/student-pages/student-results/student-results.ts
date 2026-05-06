import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectionService, Candidate, Election } from '../../../../services/election';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-results.html',
  styleUrl: './student-results.scss',
})
export class StudentResults implements OnInit, OnDestroy {
positions: any;
turnoutP: any;
turnoutPPercent: any;
turnoutPercent: any;
selectedElectionId: any;
elections: any;
getInitials(arg0: any) {
throw new Error('Method not implemented.');
}

  candidates: Candidate[] = [];
  activeElection: Election | null = null;
  loading = true;
  private refreshInterval: any;

  constructor(private svc: ElectionService) {}

  ngOnInit(): void {
    this.loadResults();
    // auto-refresh every 15 seconds so results stay live
    this.refreshInterval = setInterval(() => this.loadResults(), 15000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadResults(): void {
    this.svc.getActiveElection().subscribe(elections => {
      this.activeElection = elections[0] || null;
    });

    this.svc.getCandidates().subscribe(all => {
      this.candidates = all.filter(c => c.status === 'approved');
      this.loading = false;
    });
  }

  get resultsByPosition(): { position: string; candidates: Candidate[]; totalVotes: number }[] {
    const map = new Map<string, Candidate[]>();
    for (const c of this.candidates) {
      if (!map.has(c.position)) map.set(c.position, []);
      map.get(c.position)!.push(c);
    }
    return Array.from(map.entries()).map(([position, candidates]) => {
      const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
      return {
        position,
        candidates: sorted,
        totalVotes: sorted.reduce((s, c) => s + c.votes, 0)
      };
    });
  }

  get totalVotes(): number {
    return this.candidates.reduce((sum, c) => sum + c.votes, 0);
  }

  getPercentage(votes: number, total: number): number {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  }

  isWinner(c: Candidate, group: { candidates: Candidate[] }): boolean {
    return group.candidates[0]?.id === c.id && c.votes > 0;
  }

  getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() || '?';
  }
}