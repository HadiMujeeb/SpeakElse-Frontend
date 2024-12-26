import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../layouts/user/header/header.component';
import { FooterComponent } from '../../../layouts/user/footer/footer.component';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { IReponseRatings } from '../../../shared/models/friendsRating.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentor-process-info',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule],
  templateUrl: './mentor-process-info.component.html',
  styleUrl: './mentor-process-info.component.css'
})
export class MentorProcessInfoComponent implements OnInit {
  
  rating: number = 4.8;  // Example rating
  feedbackCount: number=1000
  user: any;
  userProfileServices = inject(UserProfileService);
  router = inject(Router);
  ngOnInit(): void {
    // const userData = localStorage.getItem('userData');
    // if (userData) {
    //   this.user = JSON.parse(userData);
    // }
    
    // if (this.user?.id) {
    //   // Fetch ratings from the API
    //   this.userProfileServices.requestGetFriendRating(this.user.id).subscribe(
    //     (ratings: IReponseRatings[]) => {
    //       this.feedbackCount = ratings.length;
    //       this.rating = Math.round((ratings.reduce((total, rating) => total + rating.rating, 0) / ratings.length) * 10) / 10;

    //     },
    //     (error) => {
    //       console.error('Error fetching user ratings:', error);
    //     }
    //   );
    // }
  }
  isEligible(): boolean {
    return this.rating >= 4.7 && this.feedbackCount >= 1000;
  }

  launchTest() {
    this.router.navigate(['/user/test/readingTest']);
  }
}
