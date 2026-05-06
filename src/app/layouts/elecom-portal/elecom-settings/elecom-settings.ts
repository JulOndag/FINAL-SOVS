import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-elecom-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elecom-settings.html',
  styleUrl: './elecom-settings.scss',
})
export class ElecomSettings {
  tab: 'profile' | 'security' | 'system' = 'profile';

  profile = {
    name: 'Admin User',
    email: 'admin@ustp.edu.ph',
    phone: '',
    department: 'Electoral Commission',
  };

  security = {
    current: '',
    newPass: '',
    confirm: '',
    sessionTimeout: true,
  };

  system = {
    emailNotifs:       true,
    voterVerification: true,
    liveResults:       false,
    applicationsOpen:  true,
  };

  getInitial(): string {
    return this.profile.name?.charAt(0)?.toUpperCase() || 'A';
  }

  saveProfile(): void {
    Swal.fire({ icon: 'success', title: 'Profile updated!', timer: 1500, showConfirmButton: false });
  }

  savePassword(): void {
    if (!this.security.current) { Swal.fire({ icon: 'warning', title: 'Enter your current password' }); return; }
    if (this.security.newPass !== this.security.confirm) { Swal.fire({ icon: 'error', title: 'Passwords do not match' }); return; }
    if (this.security.newPass.length < 8) { Swal.fire({ icon: 'warning', title: 'Password must be at least 8 characters' }); return; }
    Swal.fire({ icon: 'success', title: 'Password updated!', timer: 1500, showConfirmButton: false });
    this.security = { current: '', newPass: '', confirm: '', sessionTimeout: this.security.sessionTimeout };
  }

  saveSystem(): void {
    Swal.fire({ icon: 'success', title: 'Preferences saved!', timer: 1500, showConfirmButton: false });
  }
}