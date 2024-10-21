import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormModalComponent } from '../../reusable/modals/form-modal/form-modal.component';
import { IMember } from '../../../models/admin/member.interface';
import { ModalAction } from '../../reusable/enums/modalAction.enum';
import { registerField } from '../../reusable/formFieldConfig/registerFormConfig';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { MentorProfileService } from '../../../core/services/mentor/mentor-profile.service';

@Component({
  selector: 'app-mentor-pofile-content',
  standalone: true,
  imports: [CommonModule,FormModalComponent],
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



  user!:any
  ActionType!: ModalAction;
  isEditModalOpen = false; 
  selectedMember: IMember | null = null;
  fields:any[]=[];
  
  userProfileServices = inject(UserProfileService);
  mentorProfileServices = inject(MentorProfileService)
  router = inject(Router)
  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.user = JSON.parse(userData); 
    }
  }
  openEditModal() {
    this.ActionType = ModalAction.EditMember
    this.selectedMember = this.user; 
    this.isEditModalOpen = true; 
    const excludedFields = ['password', 'ConfirmPassword', 'confirmPassword'];
    this.fields = registerField.filter(f => !excludedFields.includes(f.name));
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedMember = null; 
  }

  requestEditMemberData(event:{data:IMember,file:File|null}) {
    const { data, file } = event;
    if (this.selectedMember) {
      data.id =this.selectedMember.id;
      this.user = data
      console.log(data,"dataaaa")
    }
    
 this.mentorProfileServices.requestEditMentorData(data,file).subscribe(
  response =>{
    console.log("userprofile data edit succussfully",response.message)
    this.closeEditModal();
    window.location.reload()
  },error =>{
    console.log("userDataUpdata",error.message)
  }
 )

}
}
