import { Component, inject, OnInit } from '@angular/core';
import { IMember } from '../../../shared/models/member.model';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { ModalAction } from '../../../shared/models/modal-action.enum';
import { IReponseRatings } from '../../../shared/models/friendsRating.model';
import { registerField } from '../../../shared/FieldConfigs/register-form.config';
import { CommonModule } from '@angular/common';
import { FormModalComponent } from '../../../shared/components/modals/form-modal/form-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  userRating = {
    rating: 0, // Will be calculated dynamically
    reviews: 0, // Total number of reviews
    ratingBreakdown: [
      { stars: 5, count: 0 },
      { stars: 4, count: 0 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ],
  };

  feedbacks: { name: string; date: string; rating: number; comment: string , avatar: string}[] = [];
  user: any;
  selectedMember: IMember | null = null;
  fields: any[] = [];
  isEditModalOpen = false;
  ActionType!: ModalAction;

  userProfileServices = inject(UserProfileService);
  router = inject(Router);
  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    
    if (this.user?.id) {
      // Fetch ratings from the API
      this.userProfileServices.requestGetFriendRating(this.user.id).subscribe(
        (ratings: IReponseRatings[]) => {
          console.log(ratings, 'ratings');
          this.processRatings(ratings);
        },
        (error) => {
          console.error('Error fetching user ratings:', error);
        }
      );
    }
  }

  private processRatings(ratings: IReponseRatings[]): void {
    const totalReviews = ratings.length;
    const ratingCounts = [0, 0, 0, 0, 0]; 
    let totalRating = 0;

    // Process ratings and feedbacks
    this.feedbacks = ratings.map((rating) => {
      const starsIndex = rating.rating - 1;
      if (starsIndex >= 0 && starsIndex < 5) {
        ratingCounts[starsIndex]++;
      }
      totalRating += rating.rating;
     console.log(rating.rating, 'rating');
      return {
        name: rating.givenBy.name,
        date: new Date(rating.createdAt).toLocaleDateString(), // Format the date
        rating: rating.rating,
        comment: rating.feedback,
        avatar: rating.givenBy  .avatar
      };
    });

    this.userRating.reviews = totalReviews;
    this.userRating.rating = totalReviews > 0 ? parseFloat((totalRating / totalReviews).toFixed(1)) : 0;
    this.userRating.ratingBreakdown = ratingCounts
      .map((count, index) => ({ stars: index + 1, count }))
      .reverse(); // Reverse for descending order
  }


  requestEditMemberData(event: { data: IMember; file: File | null }) {
    const { data, file } = event;
    if (this.selectedMember) {
      data.id = this.selectedMember.id;
      this.user = data;
    }

    this.userProfileServices.requestEditMemberData(data, file).subscribe(
      (response) => {
        console.log('userprofile data edit succussfully', response.message);
        this.closeEditModal();
        window.location.reload();
      },
      (error) => {
        console.log('userDataUpdata', error.message);
      }
    );
  }

  openEditModal() {
    this.ActionType = ModalAction.EditUser;
    this.selectedMember = this.user;
    this.isEditModalOpen = true;
    const excludedFields = [
      'password',
      'ConfirmPassword',
      'confirmPassword',
      'email',
      'role',
    ];
    this.fields = registerField.filter((f) => !excludedFields.includes(f.name));
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedMember = null;
  }
}
