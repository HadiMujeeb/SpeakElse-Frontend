import { Component, inject, OnInit } from '@angular/core';
import { ReportsService } from '../../../core/services/admin/reports.service';
import { ITransaction } from '../../../shared/models/friendsRating.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-wallet.component.html',
  styleUrls: ['./admin-wallet.component.css']
})
export class AdminWalletComponent implements OnInit {
  activeTab: string = 'MENTOR_PAYMENTS';
  reportService = inject(ReportsService);
  AllTransactions: ITransaction[] = [];
  SelectedData: any[] = [];

  // Modal state
  isModalOpen: boolean = false;
  selectedItem: any = null;

  // Headers for the table (added new columns for mentorAmount, adminAmount, sessionAmount, and status)
  headers = [
    { label: '#' },
    { label: 'Type' },
    { label: 'Date' },
    { label: 'Description' },
    { label: 'Mentor Amount' },
    { label: 'Admin Amount' },
    { label: 'Session Amount' },
    { label: 'Status' },  // New column for status
  ];

  // Summary totals
  get totalTransactions(): number {
    return this.AllTransactions.length;
  }

  get totalPayments(): number {
    return this.AllTransactions.reduce((total, transaction) => total + transaction.amount, 0); // Sum of all transaction amounts
  }

  // Switch between tabs
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.SelectedData = this.AllTransactions; // Adjust this if you need to filter data based on the tab
  }

  // View transaction details
  viewDetails(id: string): void {
    this.selectedItem = this.AllTransactions.find(item => item.id === id);
    this.isModalOpen = true;
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  ngOnInit(): void {
    this.reportService.requestGellAllTransactions().subscribe((res: any) => {
      console.log(res.message, res.data);
      this.AllTransactions = res.data;
      this.SelectedData = res.data;
    });
  }
}
