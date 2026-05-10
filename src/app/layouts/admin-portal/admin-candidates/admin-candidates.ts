import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectionService, Application, Candidate, Election } from '../../../services/election';
import { AuthService } from '../../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-candidates.html',
  styleUrls: ['./admin-candidates.scss'],
})
export class AdminCandidates implements OnInit {
  applications: Application[] = [];
  candidates: Candidate[] = [];
  elections: Election[] = [];
  loadingApps = true;
  loadingCands = true;

  activeTab: 'applications' | 'candidates' = 'applications';
  appFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'pending';

  constructor(
    private svc: ElectionService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
    this.loadCandidates();
    this.svc.getElections().subscribe((e) => (this.elections = e));
  }

  loadApplications(): void {
    this.loadingApps = true;
    this.svc.getApplications().subscribe((apps) => {
      this.applications = apps.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );
      this.loadingApps = false;
    });
  }

  loadCandidates(): void {
    this.loadingCands = true;
    this.svc.getCandidates().subscribe((c) => {
      this.candidates = c;
      this.loadingCands = false;
    });
  }

  get filteredApplications(): Application[] {
    if (this.appFilter === 'all') return this.applications;
    return this.applications.filter((a) => a.status === this.appFilter);
  }

  get pendingCount(): number {
    return this.applications.filter((a) => a.status === 'pending').length;
  }

  electionName(id: string): string {
    return this.elections.find((e) => e.id === id)?.name ?? '—';
  }

  reqCount(reqs: any): number {
    if (!reqs) return 0;
    return Object.values(reqs).filter(Boolean).length;
  }

  initial(name: string): string {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }

  approveApplication(app: Application): void {
    Swal.fire({
      title: 'Approve candidate?',
      html: `<b>${app.name}</b> for <b>${app.position}</b>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      confirmButtonText: 'Approve',
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.svc.updateApplication({ ...app, status: 'approved' }).subscribe(() => {
        // ── Save to /candidates WITH electionId ───────────────
        this.svc
          .addCandidate({
            name: app.name,
            position: app.position,
            party: app.party || 'Independent',
            photo: app.photo || '',
            votes: 0,
            bio: app.bio || '',
            course: app.course,
            year: app.year,
            status: 'approved',
            electionId: app.electionId, // ← links to ballot
            requirements: app.requirements,
          } as any)
          .subscribe(() => {
            // ── Notify student ───────────────────────────────────
            this.svc
              .addNotification({
                role: 'student',
                studentId: app.studentId,
                type: 'approved',
                title: '✅ Application Approved!',
                message: `Congratulations ${app.name}! Your application for ${app.position} has been approved. You are now an official candidate.`,
                electionId: app.electionId,
                createdAt: new Date().toISOString(),
                seen: false,
              })
              .subscribe();

            this.loadApplications();
            this.loadCandidates();
            Swal.fire({
              icon: 'success',
              title: 'Approved!',
              text: `${app.name} is now on the ballot.`,
              timer: 1500,
              showConfirmButton: false,
            });
          });
      });
    });
  }

  rejectApplication(app: Application): void {
    Swal.fire({
      title: 'Disqualify candidate?',
      html: `<b>${app.name}</b> for <b>${app.position}</b>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Disqualify',
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.svc.updateApplication({ ...app, status: 'rejected' }).subscribe(() => {
        // ── Notify student ─────────────────────────────────────
        this.svc
          .addNotification({
            role: 'student',
            studentId: app.studentId,
            type: 'rejected',
            title: '❌ Application Disqualified',
            message: `Hi ${app.name}, your application for ${app.position} has been disqualified. Please contact the admin for more details.`,
            electionId: app.electionId,
            createdAt: new Date().toISOString(),
            seen: false,
          })
          .subscribe();

        this.loadApplications();
        Swal.fire({ icon: 'info', title: 'Disqualified', timer: 1000, showConfirmButton: false });
      });
    });
  }

  appStatusClass(s?: string): string {
    return s === 'approved'
      ? 'status-active'
      : s === 'rejected'
        ? 'status-completed'
        : 'status-upcoming';
  }

  candStatusClass(s?: string): string {
    return s === 'approved' ? 'status-active' : 'status-completed';
  }
}
