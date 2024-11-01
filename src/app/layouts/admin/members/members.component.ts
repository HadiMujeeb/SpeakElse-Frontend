import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  Member,
  memberHeaders,
} from '../../../shared/FieldConfigs/memberTableField';
import { MemberMgmtService } from '../../../core/services/admin/member-mgmt.service';
import { IMember } from '../../../shared/models/member.interface';
import { FormModalComponent } from '../../../shared/components/form-modal/form-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { registerField } from '../../../shared/FieldConfigs/registerFormConfig';
import { ModalAction } from '../../../shared/models/modalAction.enum';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormModalComponent],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {
  ActionType!: ModalAction;

  MembersMgmtServices = inject(MemberMgmtService);

  totalMembers = 0;
  currentUsed = 0;
  headers = memberHeaders;
  isEditModalOpen = false;
  members: IMember[] = [];
  selectedMember: IMember | null = null;
  fields: any[] = [];

  ngOnInit(): void {
    this.MembersMgmtServices.requestRetrieveMembersList().subscribe(
      (response) => {
        this.members = response.members;
        this.totalMembers = this.members.length;
      },
      (error) => {
        console.error('Error fetching members', error);
      }
    );
  }

  openAddMember() {
    this.ActionType = ModalAction.AddMember;
    this.isEditModalOpen = true;
    this.fields = registerField;
  }

  openEditModal(member: IMember) {
    this.ActionType = ModalAction.EditMember;
    this.selectedMember = member;
    this.isEditModalOpen = true;
    const excludedFields = ['password', 'ConfirmPassword', 'confirmPassword'];
    this.fields = registerField.filter((f) => !excludedFields.includes(f.name));
  }

  requestAddMemberData(event: { data: IMember; file: File | null }) {
    const { data, file } = event;
    console.log('newMember,', file);
    this.MembersMgmtServices.requestAddMemberData(data, file).subscribe(
      (response) => {
        console.log('Add Member data response :', response);
      },
      (error) => {
        console.log('add Member reponse Error', error.message);
      }
    );
  }

  requestEditMember(event: { data: IMember; file: File | null }) {
    const { data, file } = event;
    if (this.selectedMember) {
      const index = this.members.findIndex(
        (member) => member.id === this.selectedMember!.id
      );
      if (index !== -1) {
        this.members[index] = data;
      }
      data.id = this.selectedMember.id;
      console.log(data, 'update Data');
      this.MembersMgmtServices.requestEditMemberData(data, file).subscribe(
        (response) => {
          console.log('edit member reponse', response);
        },
        (error) => {
          console.log('error reponse from editmember', error.message);
        }
      );
    }

    //  this.MembersMgmtServices.requestEditMemberData(updatedMember)
    this.closeEditModal();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedMember = null;
  }

  toggleBlockMember(id: string) {
    const memberData = this.members.find((data) => data.id === id);
    if (memberData) {
      memberData.isBlocked = !memberData.isBlocked;

      this.MembersMgmtServices.requestUpdateUserStatus(id).subscribe(
        (response) => {
          console.log('Member blocked successfully:', response);
        },
        (error) => {
          console.error('Error blocking member:', error);
          memberData.isBlocked = !memberData.isBlocked;
        }
      );
    }
  }
}
