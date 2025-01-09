import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MentorSessionService } from '../../../core/services/mentor/mentor-session.service';
import { RoomService } from '../../../core/services/user/room.service';
import { IMentorRoom } from '../../../shared/models/mentorform.model';
import { ITransaction } from '../../../shared/models/friendsRating.model';
import { platFormId } from '../../../../environment/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mysession',
  standalone: true,
  templateUrl: './mysession.component.html',
  styleUrls: ['./mysession.component.css'],
  imports: [CommonModule],
})
export class MysessionComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('userData') || '{}');
  sessions: IMentorRoom[] = [];
  userSessions: IMentorRoom[] = [];
  currentDateTime: Date = new Date();
  sessionAmount: number = 0;

  constructor(
    private mentorSessionService: MentorSessionService,
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserSessions();
  }

  // Fetch all sessions and filter for the ones booked by the user
  getUserSessions() {
    this.mentorSessionService.requestGetAllSessions().subscribe((res: any) => {
      this.sessions = res.rooms
        .map((room: IMentorRoom) => ({
          ...room,
          startTime: new Date(room.startTime),
          endTime: new Date(room.endTime),
        }))
        .filter((session: IMentorRoom) => session.participants.includes(this.user.id)); // Only show sessions booked by the user

      this.userSessions = this.sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    });
  }

  // Mark the session as completed
  markSessionComplete(session: IMentorRoom) {
    // this.mentorSessionService.updateSessionStatus(session.id, 'COMPLETED').subscribe(() => {
    //   console.log(`Session ${session.id} marked as completed`);
    //   this.getUserSessions(); // Refresh the session list after marking as completed
    // });
  }

  // Payment Integration Logic
  // initiatePayment(session: IMentorRoom) {
  //   this.sessionAmount = session.bookingFee;
  //   const bookingFee = session.bookingFee * 100; // Convert to paise (for Razorpay)
  //   const options = {
  //     key: 'rzp_test_htApscPSpx9Vqx',
  //     amount: bookingFee, 
  //     currency: 'INR',
  //     name: 'Mentor Booking',
  //     description: `Booking session with ${session.topic}`,
  //     image: 'https://example.com/your_logo', 
  //     handler: (response: any) => {
  //       this.verifyPayment(response, session.id, session.mentorId);
  //     },
  //     prefill: {
  //       name: this.user.name,
  //       email: this.user.email,
  //       contact: this.user.phone,
  //     },
  //     notes: {
  //       sessionId: session.id,
  //     },
  //     theme: {
  //       color: '#3399cc',
  //     },
  //   };

  //   const paymentObject = new Razorpay(options);
  //   paymentObject.open();
  // }

  // Payment Verification Logic
  // verifyPayment(response: any, sessionId: string, mentorId: string) {
  //   const transactionData: ITransaction = {
  //     userId: this.user.id,
  //     mentorId: mentorId,
  //     fundReceiverId: platFormId,
  //     amount: this.sessionAmount,
  //     type: "Session Booking",
  //     status: "CREDITED",
  //     transactionId: response.razorpay_payment_id || null,
  //     paymentMethod: "Razorpay",
  //     sessionId: sessionId,
  //     description: `Payment for session: ${sessionId}`,
  //   };

  //   this.roomService.requestVerifyPayment(transactionData).subscribe(
  //     (res) => {
  //       console.log('Payment verification successful:', res.message);
  //       this.getUserSessions(); // Refresh after payment verification
  //     },
  //     (err) => {
  //       console.error('Payment verification failed:', err);
  //     }
  //   );
  // }

  // Navigate to session room
  joinSession(roomId: string) {
    this.router.navigate([`/user/room/${roomId}`]);
  }
}
