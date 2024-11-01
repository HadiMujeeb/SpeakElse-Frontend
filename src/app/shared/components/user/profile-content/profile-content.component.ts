import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormModalComponent } from '../../form-modal/form-modal.component';
import { IMember } from '../../../models/member.interface';
import { registerField } from '../../../FieldConfigs/registerFormConfig';
import { Subscription } from 'rxjs';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { ModalAction } from '../../../models/modalAction.enum';
import { UserProfileService } from '../../../../core/services/user/user-profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-content',
  standalone: true,
  imports: [CommonModule, FormModalComponent],
  templateUrl: './profile-content.component.html',
  styleUrl: './profile-content.component.css',
})
export class ProfileContentComponent implements OnInit {
  teacher = {
    rating: 4.9,
    reviews: 66,
    ratingBreakdown: [
      { stars: 5, count: 64 },
      { stars: 4, count: 2 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ],
  };

  feedbacks = [
    {
      name: 'Daniel',
      date: 'September 26, 2024',
      rating: 5,
      comment:
        'I am happy with lesson. Teacher help me kindly and clearly. I look forward to more lesson with Farrel.',
    },
    {
      name: 'Daniel',
      date: 'September 26, 2024',
      rating: 5,
      comment:
        'I am happy with lesson. Teacher help me kindly and clearly. I look forward to more lesson with Farrel.',
    },
    {
      name: 'Daniel',
      date: 'September 26, 2024',
      rating: 5,
      comment:
        'I am happy with lesson. Teacher help me kindly and clearly. I look forward to more lesson with Farrel.',
    },
    {
      name: 'Daniel',
      date: 'September 26, 2024',
      rating: 5,
      comment:
        'I am happy with lesson. Teacher help me kindly and clearly. I look forward to more lesson with Farrel.',
    },
  ];

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
  }

  requestEditMemberData(event: { data: IMember; file: File | null }) {
    const { data, file } = event;
    if (this.selectedMember) {
      data.id = this.selectedMember.id;
      this.user = data;
      console.log(data, 'dataaaa');
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
    const excludedFields = ['password', 'ConfirmPassword', 'confirmPassword','email','role'];
    this.fields = registerField.filter((f) => !excludedFields.includes(f.name));
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedMember = null;
  }
}
