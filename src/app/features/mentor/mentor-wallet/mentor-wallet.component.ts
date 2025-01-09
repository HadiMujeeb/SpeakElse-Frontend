import { Component, inject, OnInit } from '@angular/core';
import { MentorSessionService } from '../../../core/services/mentor/mentor-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentor-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentor-wallet.component.html',
  styleUrls: ['./mentor-wallet.component.css'],

})
export class MentorWalletComponent implements OnInit {
  mentor = JSON.parse(localStorage.getItem('mentorData') || '{}'); // Retrieve mentor data
  totalWalletAmount: number = 0; // Total wallet balance
  transactions: any[] = []; // Transactions array
sessionService = inject(MentorSessionService);
  ngOnInit(): void {
    this.sessionService.requestGetSessionByMentorId(this.mentor?.id || '').subscribe(
      (response: any) => {
        this.transactions = response.transactions.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || []; 
      }
    )
    this.totalWalletAmount = this.mentor.mentorWallet?.balance || 0;
  }
}
