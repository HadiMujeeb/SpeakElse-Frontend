import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IComment } from '../../models/friendsRating.model';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
interface RatingData {
  rating: number;
  feedback: string;
  userId: string;
}
@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {
  profileService = inject(UserProfileService);
  @Input() showRatingModal = false;
  @Input() userId: string = '';
  rating = 0; // Current rating
  feedback = ''; // User feedback
  userAvatar = 'https://via.placeholder.com/150'; // Replace with user avatar URL
  userName = 'John Doe'; // Replace with the actual user name
  givenById = JSON.parse(localStorage.getItem('userData') || '{}').id;
  comment: IComment={ userId: '', feedback: '', rating: 0, givenBy: ''};

  setRating(star: number) {
    this.rating = star;
  }

  closeRatingModal() {
    this.showRatingModal = false;
  }

  submitRating() {
    console.log('Rating:', this.rating);
    console.log('Feedback:', this.feedback);
    console.log('User ID:', this.userId);
    console.log('Given By ID:', this.givenById);
    
   this.comment = { userId: this.userId, feedback: this.feedback, rating: this.rating, givenBy: this.givenById };
   this.profileService.requestGiveRating(this.comment).subscribe((res)=>{
    console.log(res);
   })
    this.closeRatingModal(); // Close modal after submission
  }
}
