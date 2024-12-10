import { Component, inject, OnInit } from '@angular/core';
import { MemberMgmtService } from '../../../core/services/admin/member-mgmt.service';
import { IMember } from '../../../shared/models/member.model';
import { ModalAction } from '../../../shared/models/modal-action.enum';
import { memberHeaders } from '../../../shared/FieldConfigs/member-table.fields';
import { FormModalComponent } from '../../../shared/components/form-modal/form-modal.component';
import { registerField } from '../../../shared/FieldConfigs/register-form.config';
import { CommonModule } from '@angular/common';

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
  filteredMembers: IMember[] = [];
  selectedMember: IMember | null = null;
  fields: any[] = [];
  activeRole: string = 'USER';

  ngOnInit(): void {
    this.MembersMgmtServices.requestRetrieveMembersList().subscribe(
      (response) => {
        this.members = response.members;
        this.totalMembers = this.members.length;
        const users = this.members.filter(member => member.role === 'USER')
        this.filteredMembers = [...users]; // Initially show all members
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

  filterMembers(role: string) {
    this.activeRole = role;
    if (role === 'USER') {
      this.filteredMembers = this.members.filter(member => member.role === 'USER');
    } else if (role === 'ADMIN') {
      this.filteredMembers = this.members.filter(member => member.role === 'ADMIN');
    } else if (role === 'MENTOR') {
      this.filteredMembers = this.members.filter(member => member.role === 'MENTOR');
    } else {
      this.filteredMembers = [...this.members]; // Show all members if no role is selected
    }
  }

  requestAddMemberData(event: { data: IMember; file: File | null }) {
    const { data, file } = event;
    this.MembersMgmtServices.requestAddMemberData(data, file).subscribe(
      (response) => {
        console.log('Add Member data response :', response);
        // this.members.push(response.member); // Optionally, update the local member list
        this.filterMembers('USER'); // Refresh after adding a member
      },
      (error) => {
        console.log('add Member response Error', error.message);
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
      this.MembersMgmtServices.requestEditMemberData(data, file).subscribe(
        (response) => {
          console.log('edit member response', response);
        },
        (error) => {
          console.log('error response from edit member', error.message);
        }
      );
    }
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
