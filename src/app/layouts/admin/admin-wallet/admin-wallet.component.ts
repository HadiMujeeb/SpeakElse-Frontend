import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReportsService } from '../../../core/services/admin/reports.service';
import { ITransaction } from '../../../shared/models/friendsRating.model';

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
  SelectedData:any[] = [];

  // mentorPayments = [
  //   { id: 1, amount: 200, type: 'Credit', date: new Date(), description: 'Monthly payment' },
  //   { id: 2, amount: 150, type: 'Debit', date: new Date(), description: 'Refund' },
  // ];

  // userTransactions = [
  //   { id: 1, amount: 50, type: 'Credit', date: new Date(), description: 'Top-up' },
  //   { id: 2, amount: 75, type: 'Debit', date: new Date(), description: 'Purchase' },
  // ];

  // Modal state
  isModalOpen: boolean = false;
  selectedItem: any = null;

  // Headers for the table
  headers = [
    { label: '#' },
    { label: 'Amount' },
    { label: 'Type' },
    { label: 'Date' },
    { label: 'Description' },
    { label: 'Actions' },
  ];

  // Summary totals
  get totalTransactions(): number {
    return this.AllTransactions.length;
  }

  get totalPayments(): number {
    return this.AllTransactions.length;
  }

  // Switch between tabs
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.SelectedData =this.AllTransactions
  }

  // View transaction details
  viewDetails(id: number): void {
    // const dataSource = this.activeTab === 'MENTOR_PAYMENTS' ? this.mentorPayments : this.userTransactions;
    // this.selectedItem = dataSource.find(item => item.id === id);
    // this.isModalOpen = true;
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  // Delete an item
  deleteItem(id: number): void {
    // if (this.activeTab === 'MENTOR_PAYMENTS') {
    //   this.mentorPayments = this.mentorPayments.filter(item => item.id !== id);
    // } else {
    //   this.userTransactions = this.userTransactions.filter(item => item.id !== id);
    // }
  }

  ngOnInit(): void {
    this.reportService.requestGellAllTransactions().subscribe((res: any) => {
      console.log(res.message, res.data);
      this.AllTransactions = res.data;
    });
  }
}
