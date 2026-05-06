import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Notification {
  id: string;
  type: 'vote' | 'candidate' | 'election' | 'warning' | 'user';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-elecom-notif',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './elecom-notif.html',
  styleUrl: './elecom-notif.scss',
})
export class ElecomNotif implements OnInit {
  filter: 'all' | 'unread' | 'vote' | 'candidate' | 'election' = 'all';

  notifications: Notification[] = [
    { id: '1', type: 'vote',      title: 'New vote cast',          message: 'A registered voter has submitted their ballot.',          time: '5 min ago',  read: false },
    { id: '2', type: 'candidate', title: 'Candidate pending review', message: 'Maria Santos applied for President — awaiting approval.', time: '18 min ago', read: false },
    { id: '3', type: 'vote',      title: 'New vote cast',          message: 'A registered voter has submitted their ballot.',          time: '32 min ago', read: false },
    { id: '4', type: 'election',  title: 'Election started',        message: 'USC General Elections 2025 is now active.',               time: '2 hrs ago',  read: true  },
    { id: '5', type: 'candidate', title: 'Candidate approved',      message: 'Juan dela Cruz was approved for Vice President.',         time: '3 hrs ago',  read: true  },
    { id: '6', type: 'user',      title: 'Voter registered',        message: 'Student ID 2024-0041 was verified and registered.',       time: 'Yesterday',  read: true  },
    { id: '7', type: 'warning',   title: 'Low voter turnout',       message: 'Only 23% of registered voters have voted so far.',        time: 'Yesterday',  read: true  },
    { id: '8', type: 'election',  title: 'Election configured',     message: '7 positions were set up for the upcoming election.',      time: '2 days ago', read: true  },
  ];

  ngOnInit(): void {}

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get filteredNotifs(): Notification[] {
    if (this.filter === 'unread') return this.notifications.filter(n => !n.read);
    if (this.filter === 'all')    return this.notifications;
    return this.notifications.filter(n => n.type === this.filter);
  }

  markRead(n: Notification): void {
    n.read = true;
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
  }
}