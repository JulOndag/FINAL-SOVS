import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export interface Submission {
  id: string;
  type: 'candidates' | 'results' | 'timeline' | 'rules';
  typeLabel: string;
  typeClass: string;
  submittedBy: string;
  dateSubmitted: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface ActivityItem {
  type: 'approved' | 'rejected' | 'submitted' | 'info';
  message: string;
  time: string;
}

export interface ElectionPhase {
  name: string;
  date: string;
  completed: boolean;
  active: boolean;
}

export interface CandidateResult {
  name: string;
  votes: number;
  percentage: number;
}

export interface PositionResult {
  id: string;
  position: string;
  totalVotes: number;
  winner: string;
  candidates: CandidateResult[];
}

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminDashboard implements OnInit, AfterViewInit {
  // ── Stat cards ──────────────────────────────────
  pendingCount = 2;
  approvedCount = 11;
  rejectedCount = 2;
  daysLeft = 18;
  currentCycleLabel = 'S.Y. 2024–2025';

  // ── Results state ────────────────────────────────
  // 'pending'   = ELECOM hasn't submitted results yet
  // 'submitted' = ELECOM submitted, admin needs to certify
  // 'certified' = Admin has certified
  resultsStatus: 'pending' | 'submitted' | 'certified' = 'submitted';
  certifiedDate: Date | null = null;

  get resultsStatusLabel(): string {
    const labels = {
      pending: 'Awaiting Submission',
      submitted: 'Pending Certification',
      certified: 'Officially Certified',
    };
    return labels[this.resultsStatus];
  }

  // ── Chart colors ─────────────────────────────────
  chartColors = ['#0f172a', '#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899'];

  // ── Election results (mock — replace with API data) ──
  electionResults: PositionResult[] = [
    {
      id: 'president',
      position: 'SSG President',
      totalVotes: 412,
      winner: 'Maria Santos',
      candidates: [
        { name: 'Maria Santos', votes: 210, percentage: 51 },
        { name: 'Juan Dela Cruz', votes: 132, percentage: 32 },
        { name: 'Carlo Reyes', votes: 70, percentage: 17 },
      ],
    },
    {
      id: 'vp',
      position: 'SSG Vice President',
      totalVotes: 398,
      winner: 'Ana Lim',
      candidates: [
        { name: 'Ana Lim', votes: 198, percentage: 50 },
        { name: 'Rico Bautista', votes: 120, percentage: 30 },
        { name: 'Lea Fernandez', votes: 80, percentage: 20 },
      ],
    },
    {
      id: 'secretary',
      position: 'SSG Secretary',
      totalVotes: 380,
      winner: 'Paolo Cruz',
      candidates: [
        { name: 'Paolo Cruz', votes: 200, percentage: 53 },
        { name: 'Nina Villanueva', votes: 180, percentage: 47 },
      ],
    },
    {
      id: 'treasurer',
      position: 'SSG Treasurer',
      totalVotes: 375,
      winner: 'Sofia Tan',
      candidates: [
        { name: 'Sofia Tan', votes: 215, percentage: 57 },
        { name: 'Mark Gomez', votes: 160, percentage: 43 },
      ],
    },
  ];

  // ── Pending submissions ──────────────────────────
  pendingSubmissions: Submission[] = [
    {
      id: 'sub-001',
      type: 'candidates',
      typeLabel: 'Candidate List',
      typeClass: 'icon-candidates',
      submittedBy: 'ELECOM Chair',
      dateSubmitted: new Date('2025-04-22'),
      priority: 'high',
    },
    {
      id: 'sub-002',
      type: 'timeline',
      typeLabel: 'Election Timeline',
      typeClass: 'icon-timeline',
      submittedBy: 'ELECOM Secretary',
      dateSubmitted: new Date('2025-04-21'),
      priority: 'high',
    },
    {
      id: 'sub-003',
      type: 'rules',
      typeLabel: 'Rule Amendment',
      typeClass: 'icon-rules',
      submittedBy: 'ELECOM Chair',
      dateSubmitted: new Date('2025-04-20'),
      priority: 'medium',
    },
    {
      id: 'sub-004',
      type: 'results',
      typeLabel: 'Preliminary Results',
      typeClass: 'icon-results',
      submittedBy: 'ELECOM Tally',
      dateSubmitted: new Date('2025-04-19'),
      priority: 'low',
    },
  ];

  // ── Recent activity ──────────────────────────────
  recentActivity: ActivityItem[] = [
    { type: 'approved', message: 'Candidate list for President approved.', time: '2 hours ago' },
    {
      type: 'rejected',
      message: 'Rule change returned — violates school policy.',
      time: '5 hours ago',
    },
    { type: 'submitted', message: 'ELECOM submitted new election timeline.', time: 'Yesterday' },
    { type: 'approved', message: 'Voter eligibility criteria certified.', time: '2 days ago' },
    { type: 'info', message: 'Election cycle officially started.', time: '1 week ago' },
  ];

  // ── Election phases ──────────────────────────────
  electionPhases: ElectionPhase[] = [
    { name: 'Filing of Candidacy', date: 'Apr 10–14', completed: true, active: false },
    { name: 'Candidate Qualification', date: 'Apr 15–18', completed: true, active: false },
    { name: 'Campaigning Period', date: 'Apr 21–25', completed: false, active: true },
    { name: 'Election Day', date: 'Apr 28', completed: false, active: false },
    { name: 'Results Certification', date: 'Apr 30', completed: false, active: false },
  ];

  ngOnInit(): void {
    this.pendingCount = this.pendingSubmissions.filter((s) => s.priority === 'high').length;
  }

  ngAfterViewInit(): void {
    // Render pie charts after DOM is ready
    if (this.resultsStatus !== 'pending') {
      setTimeout(() => this.renderCharts(), 100);
    }
  }

  renderCharts(): void {
    this.electionResults.forEach((position) => {
      const canvas = document.getElementById('chart-' + position.id) as HTMLCanvasElement;
      if (!canvas) return;

      // Destroy existing chart if any
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();

      new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: position.candidates.map((c) => c.name),
          datasets: [
            {
              data: position.candidates.map((c) => c.votes),
              backgroundColor: this.chartColors.slice(0, position.candidates.length),
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: '60%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const candidate = position.candidates[ctx.dataIndex];
                  return ` ${candidate.name}: ${candidate.votes} votes (${candidate.percentage}%)`;
                },
              },
            },
          },
        },
      });
    });
  }

  // ── Actions ──────────────────────────────────────
  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    console.log('Filter:', value);
  }

  reviewSubmission(submission: Submission): void {
    console.log('Review:', submission.id);
  }

  quickApprove(submission: Submission): void {
    this.pendingSubmissions = this.pendingSubmissions.filter((s) => s.id !== submission.id);
    this.approvedCount++;
    this.pendingCount = this.pendingSubmissions.length;
    this.recentActivity.unshift({
      type: 'approved',
      message: `${submission.typeLabel} approved.`,
      time: 'Just now',
    });
  }

  certifyResults(): void {
    this.resultsStatus = 'certified';
    this.certifiedDate = new Date();
    this.recentActivity.unshift({
      type: 'approved',
      message: 'Election results officially certified.',
      time: 'Just now',
    });
    // Update phase tracker
    this.electionPhases[4].completed = true;
    this.electionPhases[4].active = false;
  }

  returnResults(): void {
    this.resultsStatus = 'pending';
    this.recentActivity.unshift({
      type: 'rejected',
      message: 'Election results returned to ELECOM for revision.',
      time: 'Just now',
    });
  }
}
