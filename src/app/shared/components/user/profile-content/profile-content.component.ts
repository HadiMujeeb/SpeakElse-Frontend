import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-content.component.html',
  styleUrl: './profile-content.component.css'
})
export class ProfileContentComponent {
  userName = 'Maya';
  teacher = {
    name: 'Eduardo S.',
    job: 'Web Developer',
    email: 'mayankiver52@gmail.com',
    country: 'Netherlands',
    rating: 4.9,
    reviews: 66,
    ratingBreakdown: [
      { stars: 5, count: 64 },
      { stars: 4, count: 2 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ]
  };
  
  feedbacks = [
    { name: 'Daniel', date: 'September 26, 2024', rating: 5, comment: 'I am happy with lesson. Teacher help me kindly and clearly. I look forward to more lesson with Farrel.' },
    { name: 'Daniel', date: 'September 26, 2024', rating: 5, comment: 'I am happy with lesson. Teacher help me kindly and clearly. I look forward to more lesson with Farrel.' },
    { name: 'Daniel', date: 'September 26, 2024', rating: 5, comment: 'I am happy with lesson. Teacher help me kindly and clearly. I look forward to more lesson with Farrel.' },
    { name: 'Daniel', date: 'September 26, 2024', rating: 5, comment: 'I am happy with lesson. Teacher help me kindly and clearly. I look forward to more lesson with Farrel.' },
  ];
}
