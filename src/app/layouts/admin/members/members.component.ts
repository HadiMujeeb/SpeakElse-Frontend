import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Member, memberHeaders } from '../../../shared/reusable/tableFieldConfig/memberTableField';
import { MemberMgmtService } from '../../../core/services/admin/member-mgmt.service';
import { IMember } from '../../../models/admin/member.interface';
import { FormModalComponent } from '../../../shared/reusable/modals/form-modal/form-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule,FormModalComponent],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'] // Fix the typo here (should be 'styleUrls' instead of 'styleUrl')
})
export class MembersComponent implements OnInit {
  MembersMgmtServices = inject(MemberMgmtService);
  headers = memberHeaders;

  selectedMember: IMember | null = null;

  members: IMember[] = []; 
  totalMembers = 0; 
  currentUsed = 0; 

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.MembersMgmtServices.requestRetrieveMembersList().subscribe(
      response => {
        console.log("Successfully responded", response);
        this.members = response.members
        this.totalMembers = this.members.length; 
        console.log("Successfully retrieved members:", this.members); // Log here to check the value after assignment
      },
      error => {
        console.error("Error fetching members", error); 
      }
    );
  }
  
  addMember() {
    // Logic to add a member
  }

  editMember(id: string) {
    // Logic to edit a member
  }



  toggleBlockMember(id: string) {
    const memberData = this.members.find(data=>data.id==id);
    if(memberData){
      memberData.isBlocked=!memberData.isBlocked
  
    this.MembersMgmtServices.requestUpdateUserStatus(id).subscribe(
      response =>{
      console.log('Member blocked successfully:', response);
      },
      error =>{
        console.error('Error blocking member:', error);
        memberData.isBlocked=!memberData.isBlocked
      }
    )
  }
}


openEditModal() {
  const modalRef = this.modalService.open(FormModalComponent, {
    centered: true,
    size: 'md',
     windowClass: 'custom-modal'
  });

  modalRef.result.then(
    (result) => {
      console.log('Modal closed with:', result);
    },
    (reason) => {
      console.log('Modal dismissed with:', reason);
    }
  );
}
}

