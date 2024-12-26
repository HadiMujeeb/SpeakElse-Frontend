import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { MentorSessionService } from '../../../core/services/mentor/mentor-session.service';
import { IMentorRoom } from '../../../shared/models/mentorform.model';
import { ReportsService } from '../../../core/services/admin/reports.service';
import { ITransaction } from '../../../shared/models/friendsRating.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('monthlyRevenueChartCanvas') monthlyRevenueChartCanvas!: ElementRef;
  @ViewChild('yearlyRevenueChartCanvas') yearlyRevenueChartCanvas!: ElementRef;

  totalAttendedSessions: number = 0;
  totalCanceledSessions: number = 0;
  totalRevenue = 0;
  todayRevenue = 0;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();

  monthlyRevenueData = Array(12).fill(0); // Initialize for 12 months
  yearlyRevenueData = Array(this.currentYear - 2016 + 1).fill(0); // From 2016 to the current year

  sessionService = inject(MentorSessionService);
  reportServices = inject(ReportsService);
  mentor = JSON.parse(localStorage.getItem('mentorData') || '{}');

  ngOnInit(): void {
    this.sessionService.requestGetSessionByMentorId(this.mentor?.id || '').subscribe(
      (response: any) => {
        console.log('Transactions:', response.transactions);

        // Calculate session stats
        this.totalAttendedSessions = response.rooms.filter((room: IMentorRoom) => room.status === 'ACTIVE').length;
        this.totalCanceledSessions = response.rooms.filter((room: IMentorRoom) => room.status === 'CANCELED').length;

        // Calculate total revenue
        this.totalRevenue = response.transactions.reduce((total: number, transaction: ITransaction) => total + (transaction.mentorAmount || 0), 0);

        // Calculate today's revenue
        this.todayRevenue = response.transactions
          .filter((transaction: ITransaction) => {
            const transactionDate = new Date(transaction.createdAt!);
            const today = new Date();
            return (
              transactionDate.getDate() === today.getDate() &&
              transactionDate.getMonth() === today.getMonth() &&
              transactionDate.getFullYear() === today.getFullYear()
            );
          })
          .reduce((total: number, transaction: ITransaction) => total + (transaction.mentorAmount || 0), 0);

        // Calculate current month's revenue
        this.monthlyRevenueData[this.currentMonth] = response.transactions
          .filter((transaction: ITransaction) => {
            const transactionDate = new Date(transaction.createdAt!);
            return (
              transactionDate.getMonth() === this.currentMonth &&
              transactionDate.getFullYear() === this.currentYear
            );
          })
          .reduce((total: number, transaction: ITransaction) => total + (transaction.mentorAmount || 0), 0);

        // Calculate current year's revenue
        this.yearlyRevenueData[this.currentYear - 2016] = response.transactions
          .filter((transaction: ITransaction) => {
            const transactionDate = new Date(transaction.createdAt!);
            return transactionDate.getFullYear() === this.currentYear;
          })
          .reduce((total: number, transaction: ITransaction) => total + (transaction.mentorAmount || 0), 0);

        console.log('Monthly Revenue Data:', this.monthlyRevenueData);
        console.log('Yearly Revenue Data:', this.yearlyRevenueData);

        // Initialize charts after data processing
        this.initializeMonthlyRevenueChart();
        this.initializeYearlyRevenueChart();
      }
    );
  }

  initializeMonthlyRevenueChart() {
    new Chart(this.monthlyRevenueChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        datasets: [
          {
            label: 'Revenue ($)',
            data: this.monthlyRevenueData,
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }

  initializeYearlyRevenueChart() {
    const years = Array.from({ length: this.currentYear - 2016 + 1 }, (_, i) => 2016 + i);
    new Chart(this.yearlyRevenueChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Revenue ($)',
            data: this.yearlyRevenueData,
            backgroundColor: '#4F46E5',
            borderColor: '#3B82F6',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
