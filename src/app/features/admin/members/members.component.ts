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
  filteredMembersPaginated: IMember[] = [];
  selectedMember: IMember | null = null;
  headers = memberHeaders;
  fields: any[] = [];
  isEditModalOpen = false;
  activeRole = 'USER';

  page: number = 1;
  pageSize: number = 10;

  ActionType!: ModalAction;

  MembersMgmtServices = inject(MemberMgmtService);

  ngOnInit(): void {
    this.retrieveMembersList();
    this.goToPage(1)

  }

  private retrieveMembersList(): void {
    this.MembersMgmtServices.requestRetrieveMembersList().subscribe(
      (response: any) => {
        this.members = response.members;
        this.filterMembers(this.activeRole);
      },
      (error) => {
        console.error('Error fetching members', error);
      }
    );
  }

  openAddMember(): void {
    this.ActionType = ModalAction.AddMember;
    this.isEditModalOpen = true;
    const excludedFields = ['description', 'language', 'avatar'];
    this.fields = registerField.filter((f) => !excludedFields.includes(f.name));
  }

  openEditModal(member: IMember): void {
    this.ActionType = ModalAction.EditMember;
    this.selectedMember = member;
    this.isEditModalOpen = true;
    const excludedFields = ['password', 'confirmPassword', 'avatar', 'description'];
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

    this.page = 1; // Reset page to first
    this.updatePaginatedMembers();
  }

  updatePaginatedMembers(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    this.filteredMembersPaginated = this.filteredMembers.slice(startIndex, startIndex + this.pageSize);

  }

  requestAddMemberData(event: { data: IMember; file: File | null }): void {
    const { data, file } = event;
    this.MembersMgmtServices.requestAddMemberData(data, file).subscribe(
      (response) => {
        this.members.push(response.member);
        this.filterMembers(this.activeRole);
      },
      (error) => {
        console.log('Add Member response Error:', error.message);
      }
    );
  }

  requestEditMember(event: { data: IMember; file: File | null }): void {
    const { data, file } = event;
    if (this.selectedMember) {
      const index = this.members.findIndex((member) => member.id === this.selectedMember!.id);
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

  get totalPages(): number {
    return Math.ceil(this.filteredMembers.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedMembers();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePaginatedMembers();
    }
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.updatePaginatedMembers();
    }
  }
}
