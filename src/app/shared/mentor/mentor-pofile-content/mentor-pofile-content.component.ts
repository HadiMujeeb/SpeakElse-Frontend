import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mentor-pofile-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentor-pofile-content.component.html',
  styleUrl: './mentor-pofile-content.component.css'
})
export class MentorPofileContentComponent {
  profile = {
    name: 'Tonmoy Karmoker',
    job: 'Web Designer',
    rating: 4.9,
    reviews: 131,
    hourlyRate: 15,
    location: 'Bangladesh',
    skills: ['User Interface (UI)', 'Adobe XD', 'UI/UX', 'HTML', 'CSS'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  };

  portfolio = [
    { title: 'Landing Page Design', number: '01' },
    { title: 'Website Page Design', number: '02' },
  ];

  reviews = [
    { title: 'Landing Page Design', rating: 5.0, author: 'CHRIS MORRIS', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna' },
    { title: 'Landing Page Design', rating: 5.0, author: 'CHRIS MORRIS', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna' },
    { title: 'Landing Page Design', rating: 5.0, author: 'CHRIS MORRIS', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna' },
  ];
}
