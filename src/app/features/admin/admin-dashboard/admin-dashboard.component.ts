import { Component, AfterViewInit, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { MemberMgmtService } from '../../../core/services/admin/member-mgmt.service';
import { LanguageTestService } from '../../../core/services/admin/language-test.service';
import { ReportsService } from '../../../core/services/admin/reports.service';
import { MentorformService } from '../../../core/services/admin/mentorform.service';
import { RoomService } from '../../../core/services/user/room.service';
import { IApplication } from '../../../shared/models/mentorform.model';
import { ITransaction } from '../../../shared/models/friendsRating.model';
import { IMember } from '../../../shared/models/member.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit, OnInit {
  @ViewChild('userChartCanvas') userChartCanvas!: ElementRef;
  @ViewChild('revenueChartCanvas') revenueChartCanvas!: ElementRef;

  // Service injections
  memberService = inject(MemberMgmtService);
  languageTestService = inject(LanguageTestService);
  reportService = inject(ReportsService);
  mentorFormService = inject(MentorformService);
  roomService = inject(RoomService);

  // Dashboard Metrics
  totalUsers: number = 0;
  totalApplications: number = 0;
  totalReports: number = 0;
  totalMentors: number = 0;
  totalCreatedRooms: number = 0;
  totalRevenue: number = 0;
  totalAdmins: number = 0;
  

  // Chart Labels
  chartLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Chart Data
  monthlyUserData = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Users' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Mentors' }
  ];

  revenueChartData = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Revenue ($)' }
  ];

  chartOptions = {
    responsive: true,
    animation: {
      duration: 1000
    },
  };

  ngOnInit(): void {
    this.fetchTotalUsers();
    this.fetchTotalReports();
    this.fetchTotalApplications();
    this.fetchTotalMentors();
    this.fetchTotalRevenue();
    this.fetchTotalAdmins();
  }

  ngAfterViewInit(): void {
    this.renderUserGrowthChart();
    this.renderRevenueChart();
  }

  // Fetch Total Users
  fetchTotalUsers() {
    this.memberService.requestRetrieveMembersList().subscribe(
      (response) => {
        this.totalUsers = response.members.length;
        this.populateMonthlyData(response.members, 'createdAt', this.monthlyUserData[0].data);
      },
      (error) => console.error('Error fetching users:', error)
    );
  }

  // Fetch Total Reports
  fetchTotalReports() {
    this.reportService.requestGetAllReports().subscribe(
      (response: any) => {
        this.totalReports = response.data.length;
      },
      (error) => console.error('Error fetching reports:', error)
    );
  }

  // Fetch Total Applications
  fetchTotalApplications() {
    this.mentorFormService.requestGetMentorForm().subscribe(
      (response: any) => {
        this.totalApplications = response.applications.length;
      },
      (error) => console.error('Error fetching applications:', error)
    );
  }

  // Fetch Total Mentors
  fetchTotalMentors() {
    this.mentorFormService.requestGetMentorForm().subscribe(
      (response: any) => {
        this.totalMentors = response.applications.filter((mentor: IApplication) => mentor.approvalStatus === 'APPROVED').length;
        this.populateMonthlyData(response.applications, 'approvalDate', this.monthlyUserData[1].data);
      },
      (error) => console.error('Error fetching mentors:', error)
    );
  }

  // Fetch Total Revenue
  fetchTotalRevenue() {
    this.reportService.requestGellAllTransactions().subscribe(
      (response: any) => {
        this.totalRevenue = response.data.reduce((sum: number, transaction: ITransaction) => {
          return transaction.status === 'CREDITED' 
            ? sum + (transaction.adminAmount || 0) 
            : sum;
        }, 0);
        
        this.populateMonthlyData(response.data, 'transactionDate', this.revenueChartData[0].data, 'adminAmount');
      },
      (error) => console.error('Error fetching transactions:', error)
    );
  }

  // Fetch Total Admins
  fetchTotalAdmins() {
    this.memberService.requestRetrieveMembersList().subscribe(
      (response) => {
        this.totalAdmins = response.members.filter((member: IMember) => member.role === 'ADMIN').length;
      },
      (error) => console.error('Error fetching admins:', error)
    );
  }

  // Populate Monthly Data
  populateMonthlyData(data: any[], dateField: string, targetArray: number[], valueField?: string) {
    data.forEach((item) => {
      const date = new Date(item[dateField]);
      const month = date.getMonth();
      const value = valueField ? item[valueField] || 0 : 1;
      targetArray[month] += value;
    });
  }

  // Render User Growth Chart
  renderUserGrowthChart() {
    new Chart(this.userChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: this.monthlyUserData
      },
      options: this.chartOptions
    });
  }

  // Render Revenue Chart
  renderRevenueChart() {
    new Chart(this.revenueChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: this.revenueChartData
      },
      options: this.chartOptions
    });
  }

  // Toggle User Growth View
  toggleUserGrowthView(view: string) {
    if (view === 'month') {
      this.renderUserGrowthChart();
    } else if (view === 'year') {
      console.log('Yearly view not implemented yet.');
    }
  }
}
