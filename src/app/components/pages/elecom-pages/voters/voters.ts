import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectionService, Voter } from '../../../../services/election';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voters.html',
  styleUrl: './voters.scss',
})
export class Voters implements OnInit {

  voters: Voter[] = [];
  showVoterModal = false;
  voterSearch = '';
  loading = false;

  newVoter = { studentId: '', name: '', course: '', year: '1st' };
  voterYears = ['1st', '2nd', '3rd', '4th'];

  constructor(private svc: ElectionService) {}

  ngOnInit(): void { this.loadVoters(); }

  loadVoters(): void {
    this.loading = true;
    this.svc.getVoters().subscribe(v => {
      this.voters = v;
      this.loading = false;
    });
  }

  get filteredVoters(): Voter[] {
    const q = this.voterSearch.toLowerCase();
    if (!q) return this.voters;
    return this.voters.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.studentId.toLowerCase().includes(q) ||
      v.course.toLowerCase().includes(q)
    );
  }

  get totalVoters(): number   { return this.voters.length; }
  get votedCount(): number    { return this.voters.filter(v => v.hasVoted).length; }
  get notVotedCount(): number { return this.totalVoters - this.votedCount; }
  get participationRate(): number {
    return this.totalVoters > 0
      ? Math.round((this.votedCount / this.totalVoters) * 100) : 0;
  }

  markVoted(voter: Voter): void {
    const updated: Voter = {
      ...voter,
      hasVoted: true,
      verifiedAt: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
    };
    this.svc.updateVoter(updated).subscribe(() => this.loadVoters());
  }

  deleteVoter(voter: Voter): void {
    Swal.fire({
      title: 'Delete voter?',
      text: `Remove ${voter.name} from the list?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    }).then(r => {
      if (r.isConfirmed) {
        this.svc.deleteVoter(voter.id).subscribe(() => this.loadVoters());
      }
    });
  }

  addVoterSubmit(): void {
    if (!this.newVoter.studentId || !this.newVoter.name || !this.newVoter.course) return;
    const v: Omit<Voter, 'id'> = {
      studentId:  this.newVoter.studentId,
      name:       this.newVoter.name,
      course:     this.newVoter.course,
      year:       this.newVoter.year,
      hasVoted:   false,
      verifiedAt: null
    };
    this.svc.addVoter(v).subscribe(() => {
      this.loadVoters();
      this.showVoterModal = false;
      this.newVoter = { studentId: '', name: '', course: '', year: '1st' };
    });
  }
}