import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type NotifCategory = 'candidates' | 'results' | 'timeline' | 'rules' | 'system';

export interface Notification {
  id: string;
  category: NotifCategory;
  title: string;
  message: string;
  sender: string;
  time: string;
  read: boolean;
  actionRequired: boolean;
}

export interface Tab {
  key: string;
  label: string;
  count: number;
}

@Component({
  selector: 'admin-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-notifications.html',
  styleUrls: ['./admin-notifications.scss'],
})
export class AdminNotifications implements OnInit {
  activeTab = 'all';

  tabs: Tab[] = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'unread', label: 'Unread', count: 0 },
    { key: 'action', label: 'Action Needed', count: 0 },
    { key: 'candidates', label: 'Candidates', count: 0 },
    { key: 'results', label: 'Results', count: 0 },
    { key: 'timeline', label: 'Timeline', count: 0 },
    { key: 'rules', label: 'Rules', count: 0 },
  ];

  notifications: Notification[] = [
    {
      id: 'n-001',
      category: 'candidates',
      title: 'Candidate List Submitted',
      message:
        'ELECOM has submitted the qualified and disqualified candidate list for Presidential and VP positions. Please review and certify.',
      sender: 'ELECOM Chair',
      time: '2 hours ago',
      read: false,
      actionRequired: true,
    },
    {
      id: 'n-002',
      category: 'timeline',
      title: 'Election Timeline Updated',
      message:
        'ELECOM has revised the election schedule. Campaigning period moved from Apr 21 to Apr 24. Confirm it aligns with the school calendar.',
      sender: 'ELECOM Secretary',
      time: '5 hours ago',
      read: false,
      actionRequired: true,
    },
    {
      id: 'n-003',
      category: 'rules',
      title: 'Rule Amendment Proposed',
      message:
        "A proposed amendment to extend campaign poster sizes was submitted. This may conflict with the school's facilities policy. Review carefully.",
      sender: 'ELECOM Chair',
      time: 'Yesterday, 3:40 PM',
      read: false,
      actionRequired: true,
    },
    {
      id: 'n-004',
      category: 'results',
      title: 'Preliminary Results Submitted',
      message:
        'ELECOM has submitted preliminary election results for your initial review ahead of the official canvassing.',
      sender: 'ELECOM Tally Officer',
      time: 'Yesterday, 11:20 AM',
      read: true,
      actionRequired: false,
    },
    {
      id: 'n-005',
      category: 'system',
      title: 'Election Cycle Officially Started',
      message:
        'The 2024–2025 SSG Election cycle has officially begun. All submissions from ELECOM will be logged and routed to your dashboard.',
      sender: 'System',
      time: '1 week ago',
      read: true,
      actionRequired: false,
    },
  ];

  get filteredNotifications(): Notification[] {
    switch (this.activeTab) {
      case 'unread':
        return this.notifications.filter((n) => !n.read);
      case 'action':
        return this.notifications.filter((n) => n.actionRequired);
      case 'candidates':
        return this.notifications.filter((n) => n.category === 'candidates');
      case 'results':
        return this.notifications.filter((n) => n.category === 'results');
      case 'timeline':
        return this.notifications.filter((n) => n.category === 'timeline');
      case 'rules':
        return this.notifications.filter((n) => n.category === 'rules');
      default:
        return this.notifications;
    }
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  ngOnInit(): void {
    this.refreshTabCounts();
  }

  setActiveTab(key: string): void {
    this.activeTab = key;
  }

  markAsRead(notif: Notification): void {
    notif.read = true;
    this.refreshTabCounts();
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    this.refreshTabCounts();
  }

  approveFromNotif(notif: Notification): void {
    notif.actionRequired = false;
    notif.read = true;
    this.refreshTabCounts();
    console.log('Approved from notification:', notif.id);
  }

  rejectFromNotif(notif: Notification): void {
    notif.actionRequired = false;
    notif.read = true;
    this.refreshTabCounts();
    console.log('Returned from notification:', notif.id);
  }

  private refreshTabCounts(): void {
    this.tabs.find((t) => t.key === 'unread')!.count = this.notifications.filter(
      (n) => !n.read,
    ).length;
    this.tabs.find((t) => t.key === 'action')!.count = this.notifications.filter(
      (n) => n.actionRequired,
    ).length;
    this.tabs.find((t) => t.key === 'candidates')!.count = this.notifications.filter(
      (n) => n.category === 'candidates' && !n.read,
    ).length;
    this.tabs.find((t) => t.key === 'results')!.count = this.notifications.filter(
      (n) => n.category === 'results' && !n.read,
    ).length;
    this.tabs.find((t) => t.key === 'timeline')!.count = this.notifications.filter(
      (n) => n.category === 'timeline' && !n.read,
    ).length;
    this.tabs.find((t) => t.key === 'rules')!.count = this.notifications.filter(
      (n) => n.category === 'rules' && !n.read,
    ).length;
  }
}
