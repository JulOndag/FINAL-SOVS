import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectionService, Candidate } from '../../../../services/election';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results implements OnInit {

  candidates: Candidate[] = [];
  loading = false;

  constructor(private svc: ElectionService) {}

  ngOnInit(): void {
    this.loading = true;
    this.svc.getCandidates().subscribe(c => {
      this.candidates = c;
      this.loading = false;
    });
  }

  get resultsByPosition(): { position: string; candidates: Candidate[]; totalVotes: number }[] {
    const map = new Map<string, Candidate[]>();
    for (const c of this.candidates.filter(c => c.status === 'approved')) {
      if (!map.has(c.position)) map.set(c.position, []);
      map.get(c.position)!.push(c);
    }
    return Array.from(map.entries()).map(([position, candidates]) => {
      const sorted = candidates.sort((a, b) => b.votes - a.votes);
      return { position, candidates: sorted, totalVotes: sorted.reduce((s, c) => s + c.votes, 0) };
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
}