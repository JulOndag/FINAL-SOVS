import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  photo: string;
  votes: number;
  bio: string;
  course?: string;
  year?: string;
  status?: 'pending' | 'approved' | 'disqualified';
  requirements?: {
    enrollment: boolean;
    goodMoral: boolean;
    residency: boolean;
    coc: boolean;
    noViolations: boolean;
    noFailingGrades: boolean;
  };
}

export interface Voter {
  id: number;
  studentId: string;
  name: string;
  course: string;
  year: string;
  hasVoted: boolean;
  verifiedAt: string | null;
}

export interface Election {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  totalPositions: number;
  totalVoters: number;
  voted: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  name: string;
  course: string;
  year: string;
  position: string;
  party: string;
  bio: string;
  awards: string;
  photo: string;
  supportingDoc: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  electionId: number;
  requirements?: {
    enrollment: boolean;
    goodMoral: boolean;
    residency: boolean;
    coc: boolean;
    noViolations: boolean;
    noFailingGrades: boolean;
  };
}

export interface VoteRecord {
  id: string;
  studentId: string;
  electionId: number;
  votes: { [position: string]: string };
  submittedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ElectionService {
  private base = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.base}/candidates`);
  }
  addCandidate(c: Omit<Candidate, 'id'>): Observable<Candidate> {
    return this.http.post<Candidate>(`${this.base}/candidates`, c);
  }
  updateCandidate(c: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.base}/candidates/${c.id}`, c);
  }
  deleteCandidate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/candidates/${id}`);
  }

  getVoters(): Observable<Voter[]> {
    return this.http.get<Voter[]>(`${this.base}/voters`);
  }
  getVoterByStudentId(studentId: string): Observable<Voter[]> {
    return this.http.get<Voter[]>(`${this.base}/voters?studentId=${studentId}`);
  }
  addVoter(v: Omit<Voter, 'id'>): Observable<Voter> {
    return this.http.post<Voter>(`${this.base}/voters`, v);
  }
  updateVoter(v: Voter): Observable<Voter> {
    return this.http.put<Voter>(`${this.base}/voters/${v.id}`, v);
  }
  deleteVoter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/voters/${id}`);
  }

  getElections(numericId?: number): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.base}/elections`);
  }
  getActiveElection(): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.base}/elections?status=active`);
  }
  addElection(e: Omit<Election, 'id'>): Observable<Election> {
    return this.http.post<Election>(`${this.base}/elections`, e);
  }
  updateElection(e: Election): Observable<Election> {
    return this.http.put<Election>(`${this.base}/elections/${e.id}`, e);
  }
  deleteElection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/elections/${id}`);
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.base}/applications`);
  }
  getApplicationByStudentId(studentId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.base}/applications?studentId=${studentId}`);
  }
  submitApplication(a: Omit<Application, 'id'>): Observable<Application> {
    return this.http.post<Application>(`${this.base}/applications`, a);
  }
  updateApplication(a: Application): Observable<Application> {
    return this.http.put<Application>(`${this.base}/applications/${a.id}`, a);
  }

  getVoteRecords(): Observable<VoteRecord[]> {
    return this.http.get<VoteRecord[]>(`${this.base}/voteRecords`);
  }
  getVoteRecordByStudentId(studentId: string): Observable<VoteRecord[]> {
    return this.http.get<VoteRecord[]>(`${this.base}/voteRecords?studentId=${studentId}`);
  }

  castVote(
    voter: Voter,
    election: Election,
    votes: { [position: string]: string },
    candidates: Candidate[],
  ): Observable<any> {
    const record: Omit<VoteRecord, 'id'> = {
      studentId: voter.studentId,
      electionId: election.id,
      votes,
      submittedAt: new Date().toISOString(),
    };

    const candidateUpdates = Object.values(votes).map((candidateId) => {
      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate) throw new Error(`Candidate ${candidateId} not found`);
      return this.updateCandidate({ ...candidate, votes: candidate.votes + 1 });
    });

    return this.http
      .post(`${this.base}/voteRecords`, record)
      .pipe(
        switchMap(() =>
          forkJoin([
            ...candidateUpdates,
            this.updateVoter({ ...voter, hasVoted: true, verifiedAt: new Date().toISOString() }),
            this.updateElection({ ...election, voted: election.voted + 1 }),
          ]),
        ),
      );
  }
}