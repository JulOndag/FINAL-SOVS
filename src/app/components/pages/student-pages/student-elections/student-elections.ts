import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ElectionService, Election, Candidate, VoteRecord } from '../../../../services/election';
import { AuthService } from '../../../../services/auth';

interface VoteHistoryItem {
  position: string;
  candidateName: string;
  party: string;
  abstained: boolean;
}

interface ElectionHistory {
  election: Election;
  items: VoteHistoryItem[];
}

@Component({
  selector: 'app-student-elections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-elections.html',
  styleUrl: './student-elections.scss',
})
export class StudentElections implements OnInit {
  elections: Election[] = [];
  loading = true;

  /** History modal state */
  historyModal: ElectionHistory | null = null;
  historyLoading = false;

  constructor(
    private svc: ElectionService,
    private router: Router,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.svc.getElections().subscribe((elections) => {
      this.elections = elections;
      this.loading = false;
    });
  }

  goToBallot(election: Election): void {
    this.router.navigate(['/app/student-ballot', election.id]);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      active: 'Active',
      upcoming: 'Upcoming',
      completed: 'Completed',
    };
    return map[status] ?? status;
  }

  canVote(election: Election): boolean {
    return election.status === 'active';
  }

  // ── History Modal ──────────────────────────────────────────

  openHistory(election: Election): void {
    this.historyLoading = true;
    this.historyModal = { election, items: [] };

    const user = this.auth.getCurrentUser();
    if (!user) {
      this.historyLoading = false;
      return;
    }

    let record: VoteRecord | null = null;
    let candidates: Candidate[] = [];
    let done = 0;

    const tryBuild = () => {
      done++;
      if (done < 2) return;
      if (!record) {
        this.historyModal = {
          election,
          items: [
            { position: 'No vote record found', candidateName: '', party: '', abstained: false },
          ],
        };
        this.historyLoading = false;
        return;
      }

      const items: VoteHistoryItem[] = Object.entries(record.votes).map(([pos, cId]) => {
        if (!cId) {
          return { position: pos, candidateName: 'Abstained', party: '', abstained: true };
        }
        const cand = candidates.find((c) => c.id === cId);
        return {
          position: pos,
          candidateName: cand?.name ?? 'Unknown Candidate',
          party: cand?.party ?? '',
          abstained: false,
        };
      });

      // Add abstained positions (positions not recorded in votes)
      const votedPositions = new Set(Object.keys(record.votes));
      candidates
        .filter((c) => c.electionId === election.id && !votedPositions.has(c.position))
        .map((c) => c.position)
        .filter((v, i, a) => a.indexOf(v) === i)
        .forEach((pos) => {
          items.push({ position: pos, candidateName: 'Abstained', party: '', abstained: true });
        });

      this.historyModal = { election, items };
      this.historyLoading = false;
    };

    this.svc.getVoteRecordByStudentId(user.id).subscribe((records) => {
      record = records.find((r) => r.electionId === election.id) ?? null;
      tryBuild();
    });

    this.svc.getCandidatesByElection(election.id).subscribe((cands) => {
      candidates = cands;
      tryBuild();
    });
  }

  closeHistory(): void {
    this.historyModal = null;
  }
}
