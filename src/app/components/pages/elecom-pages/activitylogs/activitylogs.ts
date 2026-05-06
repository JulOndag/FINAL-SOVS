import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activitylogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activitylogs.html',
  styleUrl: './activitylogs.scss',
})
export class Activitylogs {
  // Sample data - replace with real data from your service
  activities = [
    {
      type: 'new',
      message: 'New voter registered',
      time: '10:20 AM'
    },
    {
      type: 'vote',
      message: '17 votes added to President',
      time: '5 mins ago'
    },
    {
      type: 'user',
      message: 'User789 voted',
      time: '10:15 AM'
    },
    {
      type: 'admin',
      message: 'Admin logged in',
      time: '8:40 AM'
    }
  ];
}
