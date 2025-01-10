import { Component, inject, OnInit } from '@angular/core';
import { ReportsService } from '../../../core/services/admin/reports.service';
import { ITransaction } from '../../../shared/models/friendsRating.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-wallet',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-wallet.component.html',
  styleUrls: ['./admin-wallet.component.css']
})
export class AdminWalletComponent implements OnInit {
  activeTab: string = 'MENTOR_PAYMENTS';
  reportService = inject(ReportsService);
  AllTransactions: ITransaction[] = [];
  SelectedData: ITransaction[] = [];
  paginatedData: ITransaction[] = [];
  showModal = false;
  selectedSession: any = null;
  // Pagination variables
  currentPage: number = 0;
  pageSize: number = 10;
  pages: number[] = [];

  // Filters
  filters = {
    startDate: '',
    endDate: '',
    month: '',
    year: '',
  };

  // Months
  months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Headers for the table
  headers = [
    { label: '#' },
    { label: 'Type' },
    { label: 'Date' },
    { label: 'Description' },
    { label: 'Session Amount' },
    { label: 'Status' },
  ];

  get totalTransactions(): number {
    return this.SelectedData.length;
  }

  get totalPayments(): number {
    return this.SelectedData.reduce((total, transaction) => total + transaction.amount, 0);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.SelectedData = this.AllTransactions;
    this.updatePagination();
  }

  applyFilters(): void {
    this.SelectedData = this.AllTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt!);
      const startDateMatch = this.filters.startDate
        ? transactionDate >= new Date(this.filters.startDate)
        : true;
      const endDateMatch = this.filters.endDate
        ? transactionDate <= new Date(this.filters.endDate)
        : true;
      const monthMatch = this.filters.month
        ? transactionDate.getMonth() + 1 === +this.filters.month
        : true;
      const yearMatch = this.filters.year
        ? transactionDate.getFullYear() === +this.filters.year
        : true;

      return startDateMatch && endDateMatch && monthMatch && yearMatch;
    });
    this.updatePagination();
  }

  resetFilters(): void {
    this.filters = { startDate: '', endDate: '', month: '', year: '' };
    this.SelectedData = this.AllTransactions;
    this.updatePagination();
  }

  // Pagination methods
  updatePagination(): void {
    const totalPages = Math.ceil(this.SelectedData.length / this.pageSize);
    this.pages = Array(totalPages).fill(0).map((_, i) => i);
    this.paginatedData = this.SelectedData.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  ngOnInit(): void {
    this.reportService.requestGellAllTransactions().subscribe((res: any) => {
      this.AllTransactions = res.data;
      this.SelectedData = res.data;
      this.updatePagination();
    });
  }


  viewSessionDetails(session: any) {
    this.selectedSession = session.sessionDetails; // Assuming sessionDetails is part of the item
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedSession = null;
  }
}
