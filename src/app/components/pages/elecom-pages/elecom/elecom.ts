import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-elecom',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './elecom.html',
  styleUrl: './elecom.scss',
})
export class Elecom {}