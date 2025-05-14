import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberMgmtService } from '../../../core/services/admin/member-mgmt.service';
import { IMember } from '../../../shared/models/member.model';
import { ModalAction } from '../../../shared/models/modal-action.enum';
import { memberHeaders } from '../../../shared/FieldConfigs/member-table.fields';
import { registerField } from '../../../shared/FieldConfigs/register-form.config';
import { FormModalComponent } from '../../../shared/components/modals/form-modal/form-modal.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormModalComponent],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {

  members: IMember[] = [];
  filteredMembers: IMember[] = [];
  selectedMember: IMember | null = null;


  headers = memberHeaders;
  fields: any[] = [];
  isEditModalOpen = false;
  activeRole = 'USER';


  totalMembers = 0;
  totalPages = 1;
  page = 1;
  pageSize = 6;


  ActionType!: ModalAction;


  MembersMgmtServices = inject(MemberMgmtService);


  ngOnInit(): void {
    this.retrieveMembersList();
  }
  

  private retrieveMembersList(): void {
    this.MembersMgmtServices.requestRetrieveMembersList().subscribe(
      (response: any) => {
        this.members = response.members;
        this.totalMembers = response.totalCount;
        this.totalPages = Math.ceil(this.totalMembers / this.pageSize);
        this.filterMembers('USER');
      },
      (error) => {
        console.error('Error fetching members', error);
      }
    );
  }
  


  openAddMember(): void {
    this.ActionType = ModalAction.AddMember;
    this.isEditModalOpen = true;
    const excludedFields = ['description','language','avatar'];
    this.fields = registerField.filter((f) => !excludedFields.includes(f.name));
  }

  openEditModal(member: IMember): void {
    this.ActionType = ModalAction.EditMember;
    this.selectedMember = member;
    this.isEditModalOpen = true;
    const excludedFields = ['password', 'confirmPassword','avatar'];
    this.fields = registerField.filter((f) => !excludedFields.includes(f.name));
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedMember = null;
  }


  filterMembers(role: string): void {
    this.activeRole = role;
    this.filteredMembers =
      role === 'USER'
        ? this.members.filter((member) => member.role === 'USER')
        : role === 'ADMIN'
        ? this.members.filter((member) => member.role === 'ADMIN')
        : [...this.members];
  }

  requestAddMemberData(event: { data: IMember; file: File | null }): void {
    const { data, file } = event;
    this.MembersMgmtServices.requestAddMemberData(data, file).subscribe(
      (response) => {
        console.log('Add Member data response:', response);
        this.filterMembers('USER');
      },
      (error) => {
        console.log('Add Member response Error:', error.message);
      }
    );
  }

  requestEditMember(event: { data: IMember; file: File | null }): void {
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
          console.log('Edit member response:', response);
        },
        (error) => {
          console.log('Error response from edit member:', error.message);
        }
      );
    }
    this.closeEditModal();
  }

  toggleBlockMember(id: string): void {
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


  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.retrieveMembersList();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.retrieveMembersList();
    }
  }
}
