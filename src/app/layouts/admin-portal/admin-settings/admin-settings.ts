import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AccessUser {
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'readonly';
  roleLabel: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.html',
  styleUrls: ['./admin-settings.scss'],
})
export class AdminSettings {
  activeSection = 'profile';

  settingsSections = [
    { key: 'profile', label: 'Admin Profile' },
    { key: 'election', label: 'Election Config' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'access', label: 'Access Control' },
  ];

  // Profile
  profile = {
    name: '',
    position: 'SSG Adviser',
    department: 'Student Affairs Office',
    email: '',
  };

  // Election Config
  electionConfig = {
    cycleLabel: 'S.Y. 2024–2025',
    electionDate: '2025-04-28',
    resultsDeadline: '2025-04-30',
    allowSubmissions: true,
    requireSignOff: true,
    lockAfterCert: true,
  };

  // Notification preferences
  notifPreferences = [
    {
      id: 'new_submission',
      label: 'New Submission from ELECOM',
      description: 'Get notified whenever ELECOM submits a new document for review.',
      enabled: true,
    },
    {
      id: 'action_required',
      label: 'Action Required Alerts',
      description: 'Urgent alerts for submissions that need immediate approval.',
      enabled: true,
    },
    {
      id: 'system_updates',
      label: 'System Updates',
      description: 'Non-urgent updates about the election system status.',
      enabled: false,
    },
    {
      id: 'deadline_reminders',
      label: 'Deadline Reminders',
      description: 'Reminders 24 hours before key election phase deadlines.',
      enabled: true,
    },
  ];

  // Access control
  accessUsers: AccessUser[] = [
    {
      name: 'Mr. Juan Dela Cruz',
      email: 'jdelacuz@school.edu.ph',
      role: 'superadmin',
      roleLabel: 'Super Admin',
    },
    { name: 'Ms. Maria Santos', email: 'msantos@school.edu.ph', role: 'admin', roleLabel: 'Admin' },
    {
      name: 'Mr. Carlo Reyes',
      email: 'creyes@school.edu.ph',
      role: 'readonly',
      roleLabel: 'Read Only',
    },
  ];

  newInviteEmail = '';

  setSection(key: string): void {
    this.activeSection = key;
  }

  saveProfile(): void {
    console.log('Saving profile:', this.profile);
    // TODO: call API to save profile
  }

  saveElectionConfig(): void {
    console.log('Saving election config:', this.electionConfig);
    // TODO: call API to save config
  }

  saveNotifPrefs(): void {
    console.log('Saving notif preferences:', this.notifPreferences);
    // TODO: call API to save preferences
  }

  revokeAccess(user: AccessUser): void {
    this.accessUsers = this.accessUsers.filter((u) => u.email !== user.email);
    console.log('Revoked access for:', user.email);
  }

  inviteAdmin(): void {
    if (!this.newInviteEmail) return;
    console.log('Inviting admin:', this.newInviteEmail);
    // TODO: call API to send invite
    this.newInviteEmail = '';
  }
}
