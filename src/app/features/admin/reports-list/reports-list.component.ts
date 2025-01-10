import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IResponseReport } from '../../../shared/models/friendsRating.model';
import { ReportsService } from '../../../core/services/admin/reports.service';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css'],
})
export class ReportsListComponent implements OnInit {
  reports: IResponseReport[] = [];
  filteredReports: any[] = [];
  totalReports: number = 0;
  pendingReports: number = 0;
  activeStatus: string = 'PENDING'; 
  reportServices = inject(ReportsService);

  isModalOpen: boolean = false;
  selectedReport:IResponseReport | null = null;

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    
      this.reportServices.requestGetAllReports().subscribe(
        (res: any) => {
          this.reports = res.data;
          this.totalReports = this.reports.length;
          this.pendingReports = this.reports.filter((r) => r.status === 'PENDING').length;
          this.filterReports(this.activeStatus); 
        },
        (err) => {
          console.error('Error fetching reports:', err);
        }
      )
  
  }

  filterReports(status: string): void {
    this.activeStatus = status;
    this.filteredReports = this.reports.filter(report => report.status === status);
  }

  viewReportDetails(report: any): void {
    this.selectedReport = report;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedReport = null;
  }

  toggleBlockUser(report: any): void {
    this.filteredReports.filter((r) => r.reported.id === report.reported.id)[0].reported.isBlocked = !report.reported.isBlocked;
    this.reportServices.requestBlockUnblockUser(report.reported.id).subscribe(
      (res: any) => {
        console.log(res.message);
      },
      (err) => {
        console.error('Error blocking/unblocking user:', err);
      }
    )
  }

  // Method to update the report's status
  updateStatus(report: any, event: any): void {
    const newStatus = event.target.value;
    report.status = newStatus;
    this.reportServices.requestUpdateReportStatus(report.id, newStatus).subscribe(
      (res: any) => {
        console.log(res.message);
        
      },
      (err) => {
        console.error('Error updating report status:', err);
      }
    )
  }
}
