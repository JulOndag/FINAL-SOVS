import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

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
  id: string;
  studentId: string;
  name: string;
  course: string;
  year: string;
  hasVoted: boolean;
  verifiedAt: string | null;
}

export interface Election {
  id: string;
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
  electionId: string;
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
  electionId: string;
  votes: { [position: string]: string };
  submittedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ElectionService {
  private firestore = inject(Firestore);

  // ── Candidates ──────────────────────────────────────────────────────────

  getCandidates(): Observable<Candidate[]> {
    return collectionData(collection(this.firestore, 'candidates'), {
      idField: 'id',
    }) as Observable<Candidate[]>;
  }

  addCandidate(c: Omit<Candidate, 'id'>): Observable<Candidate> {
    return from(addDoc(collection(this.firestore, 'candidates'), c)).pipe(
      map((ref) => ({ id: ref.id, ...c } as Candidate))
    );
  }

  updateCandidate(c: Candidate): Observable<Candidate> {
    const { id, ...data } = c;
    return from(updateDoc(doc(this.firestore, 'candidates', id), data)).pipe(
      map(() => c)
    );
  }

  deleteCandidate(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'candidates', id)));
  }

  // ── Voters ──────────────────────────────────────────────────────────────

  getVoters(): Observable<Voter[]> {
    return collectionData(collection(this.firestore, 'voters'), {
      idField: 'id',
    }) as Observable<Voter[]>;
  }

  getVoterByStudentId(studentId: string): Observable<Voter[]> {
    return from(
      getDocs(
        query(
          collection(this.firestore, 'voters'),
          where('studentId', '==', studentId)
        )
      )
    ).pipe(
      map((snap) =>
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Voter))
      )
    );
  }

  addVoter(v: Omit<Voter, 'id'>): Observable<Voter> {
    return from(addDoc(collection(this.firestore, 'voters'), v)).pipe(
      map((ref) => ({ id: ref.id, ...v } as Voter))
    );
  }

  updateVoter(v: Voter): Observable<Voter> {
    const { id, ...data } = v;
    return from(updateDoc(doc(this.firestore, 'voters', id), data)).pipe(
      map(() => v)
    );
  }

  deleteVoter(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'voters', id)));
  }

  // ── Elections ───────────────────────────────────────────────────────────

  getElections(): Observable<Election[]> {
    return collectionData(collection(this.firestore, 'elections'), {
      idField: 'id',
    }) as Observable<Election[]>;
  }

  getActiveElection(): Observable<Election[]> {
    return from(
      getDocs(
        query(
          collection(this.firestore, 'elections'),
          where('status', '==', 'active')
        )
      )
    ).pipe(
      map((snap) =>
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Election))
      )
    );
  }

  addElection(e: Omit<Election, 'id'>): Observable<Election> {
    return from(addDoc(collection(this.firestore, 'elections'), e)).pipe(
      map((ref) => ({ id: ref.id, ...e } as Election))
    );
  }

  updateElection(e: Election): Observable<Election> {
    const { id, ...data } = e;
    return from(updateDoc(doc(this.firestore, 'elections', id), data)).pipe(
      map(() => e)
    );
  }

  deleteElection(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'elections', id)));
  }

  // ── Applications ────────────────────────────────────────────────────────

  getApplications(): Observable<Application[]> {
    return collectionData(collection(this.firestore, 'applications'), {
      idField: 'id',
    }) as Observable<Application[]>;
  }

  getApplicationByStudentId(studentId: string): Observable<Application[]> {
    return from(
      getDocs(
        query(
          collection(this.firestore, 'applications'),
          where('studentId', '==', studentId)
        )
      )
    ).pipe(
      map((snap) =>
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application))
      )
    );
  }

  submitApplication(a: Omit<Application, 'id'>): Observable<Application> {
    return from(addDoc(collection(this.firestore, 'applications'), a)).pipe(
      map((ref) => ({ id: ref.id, ...a } as Application))
    );
  }

  updateApplication(a: Application): Observable<Application> {
    const { id, ...data } = a;
    return from(updateDoc(doc(this.firestore, 'applications', id), data)).pipe(
      map(() => a)
    );
  }

  // ── Vote Records ────────────────────────────────────────────────────────

  getVoteRecords(): Observable<VoteRecord[]> {
    return collectionData(collection(this.firestore, 'voteRecords'), {
      idField: 'id',
    }) as Observable<VoteRecord[]>;
  }

  getVoteRecordByStudentId(studentId: string): Observable<VoteRecord[]> {
    return from(
      getDocs(
        query(
          collection(this.firestore, 'voteRecords'),
          where('studentId', '==', studentId)
        )
      )
    ).pipe(
      map((snap) =>
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as VoteRecord))
      )
    );
  }

  // ── Cast Vote ───────────────────────────────────────────────────────────

  castVote(
    voter: Voter,
    election: Election,
    votes: { [position: string]: string },
    candidates: Candidate[]
  ): Observable<any> {
    const record = {
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

    return from(addDoc(collection(this.firestore, 'voteRecords'), record)).pipe(
      switchMap(() =>
        forkJoin([
          ...candidateUpdates,
          this.updateVoter({ ...voter, hasVoted: true, verifiedAt: new Date().toISOString() }),
          this.updateElection({ ...election, voted: election.voted + 1 }),
        ])
      )
    );
  }
}