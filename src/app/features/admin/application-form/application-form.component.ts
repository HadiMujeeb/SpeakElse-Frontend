import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MentorformService } from '../../../core/services/admin/mentorform.service';
import { IApplication } from '../../../shared/models/mentorform.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {
  mentorFormService = inject(MentorformService);
  totalApplications: number = 0;
  pendingApplications: number = 0;
  activeFilter: string = 'PENDING';
  AllApplications: IApplication[] = [];
  applications: IApplication[] = [];

  // Pagination properties
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  headers = [
    { label: 'No' },
    { label: 'Name' },
    { label: 'Email' },
    { label: 'Country' },
    { label: 'Interested In' },
    { label: 'Resume&userDetails' },
    { label: 'isVerified' },
    { label: 'Approval Status' },
  ];

  selectedApplication: IApplication | null = null;
  isModalOpen = false;

  ngOnInit() {
    this.fetchAllApplications();
  }

  toggleVerification(application: any) {
    application.isVerified = !application.isVerified;
    this.mentorFormService.requestVerifyApplication(application.email).subscribe((data: any) => {
      console.log(data.message);
    });
  }

  fetchAllApplications() {
    this.mentorFormService.requestGetMentorForm().subscribe((data: any) => {
      this.AllApplications = data.applications;
      this.totalApplications = this.AllApplications.length
       const filtered = this.AllApplications.filter(app => app.approvalStatus === status);
       this.pendingApplications = filtered.length;
      this.filterApplications(this.activeFilter);
    });
  }

  filterApplications(status: string) {
    this.activeFilter = status;
    const filtered = this.AllApplications.filter(app => app.approvalStatus === status);;
    this.totalPages = Math.ceil(this.totalApplications / this.pageSize);
    this.totalPagesArray = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    this.page = 1;
    this.paginate(filtered);
  }

  paginate(apps: IApplication[]) {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.applications = apps.slice(start, end);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.filterApplications(this.activeFilter);
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.filterApplications(this.activeFilter);
    }
  }

  goToPage(p: number) {
    this.page = p;
    this.filterApplications(this.activeFilter);
  }

  viewApplicationDetails(applicationId: string) {
    const application = this.applications.find(app => app.id === applicationId);
    if (application) {
      this.selectedApplication = application;
      this.isModalOpen = true;
      console.log(this.selectedApplication.user?.comments);
    }
  }

  getAverageRating(): number {
    const comments = this.selectedApplication?.user?.comments;
    if (comments && comments.length > 0) {
      const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
      return totalRating / comments.length;
    }
    return 0;
  }

  getStars(rating: number): string[] {
    return Array(rating).fill('★');
  }

  updateApprovalStatus(application: any) {
    this.mentorFormService.requestApproveApplication(application.email, application.approvalStatus).subscribe((data: any) => {
      console.log(data.message);
      this.fetchAllApplications();
    });
    this.sendEmail(application);
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedApplication = null;
  }

  sendEmail(application: any): void {
    application.isMailSend = 1;
    this.mentorFormService.sendApplicationEmail(application.email, application.approvalStatus).subscribe((data: any) => {
      console.log(data.message);
    });
  }
}
