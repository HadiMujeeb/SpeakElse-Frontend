import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.css'
})
export class ApplicationFormComponent implements OnInit {
  totalApplications: number = 0;
  pendingApplications: number = 0;
  activeFilter: string = 'PENDING';
  applications: any[] = [];
  headers = [
    { label: 'No' },
    { label: 'Name' },
    { label: 'Email' },
    { label: 'Test Type' },
    { label: 'Status' },
    { label: 'Actions' },
  ];

  selectedApplication: any;
  isModalOpen = false;

  // constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
    this.fetchApplications();
    
  }

  fetchApplications() {
    // this.applicationService.getApplications(this.activeFilter).subscribe(data => {
    //   this.applications = data.applications;
    //   this.totalApplications = data.total;
    //   this.pendingApplications = data.pending;
    // });
  }

  filterApplications(status: string) {
    this.activeFilter = status;
    this.fetchApplications();  // Refetch applications based on the selected filter
  }

  viewApplicationDetails(applicationId: string) {
    // this.applicationService.getApplicationDetails(applicationId).subscribe(data => {
    //   this.selectedApplication = data;
    //   this.isModalOpen = true;
    // });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedApplication = null;
  }

  deleteApplication(applicationId: string) {
    // this.applicationService.deleteApplication(applicationId).subscribe(() => {
    //   this.fetchApplications(); // Refetch the list after deletion
    // });
  }
}
