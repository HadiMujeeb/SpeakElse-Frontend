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
export class MentorProcessInfoComponent  {
  
  rating: number = 4.8;  // Example rating
  feedbackCount: number=1000
  user: any;
  userProfileServices = inject(UserProfileService);
  router = inject(Router);
  
  isEligible(): boolean {
    return this.rating >= 4.7 && this.feedbackCount >= 1000;
  }

  launchTest() {
    this.router.navigate(['/user/test/readingTest']);
  }
}
