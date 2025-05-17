import { Component, inject, OnInit } from '@angular/core';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../../core/services/user/wallet.service';
import { IStatus, ITransaction } from '../../../shared/models/friendsRating.model';
import { IMentorRoom } from '../../../shared/models/mentorform.model';

@Component({
  selector: 'app-user-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.css']
})
export class UserWalletComponent implements OnInit {
  userWalletService = inject(WalletService);
  allTransactions: ITransaction[] = [];
  userData = JSON.parse(localStorage.getItem('userData') || '{}');
  totalWalletAmount: number = 0;
  successfulTransactionsCount: number = 0;
  AllRooms: IMentorRoom[] = [];
  recentRefunedAmount = 0
  id:string=''

  ngOnInit(): void {
    this.totalWalletAmount = this.userData.userWallet.balance;
    this.userWalletService.requestGellAllTransactions(this.userData.id).subscribe((response: any) => {
      console.log("weewe",response)
     this.AllRooms = response.rooms.filter((room: IMentorRoom) => room.participants.includes(this.userData.id));
     this.allTransactions = response.transactions;
     this.allTransactions = this.allTransactions.map((transaction: ITransaction) => {
       transaction.room = this.AllRooms.find((room) => room.id === transaction.sessionId);
       return transaction;
     })
    });
  }

  // Calculate wallet summary from the transactions
  calculateSummary(): void {
  }

  requestRefund(transaction: ITransaction): void {
    
    transaction.mentorId = this.AllRooms.find((room) => room.id === transaction.sessionId)?.mentorId
    this.recentRefunedAmount=transaction.amount
    this.id =transaction.id||''
  this.userWalletService.requestRefundTransaction(transaction).subscribe((response: any) => {
    // console.log(response);
   
    this.totalWalletAmount +=this.recentRefunedAmount
    this.allTransactions = this.allTransactions.map(t =>
  t.id === this.id ? { ...t, status: IStatus.REFUNDED } : t
);
  })
  }
  getDisplayStatus(status: IStatus): string {
    switch(status) {
      case IStatus.CREDITED:
        return IStatus.DEBITED;  // If it's credited, show debited
      case IStatus.DEBITED:
        return IStatus.CREDITED; // If it's debited, show credited
      default:
        return status; // Keep other statuses as is
    }
  }
  getRoomStartAt(data: ITransaction): boolean {
    if (data?.room?.startTime) {
        return new Date(data.room.startTime) < new Date();
    }
    return false;
}

}
