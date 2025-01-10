import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../layouts/user/header/header.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { MentorProfileService } from '../../../core/services/mentor/mentor-profile.service';
import { IMentorRoom } from '../../../shared/models/mentorform.model';
import { Router } from '@angular/router';
import { RoomService } from '../../../core/services/user/room.service';
import { IStatus, ITransaction } from '../../../shared/models/friendsRating.model';
import { platFormId } from '../../../../environment/environment.development';
import { MentorSessionService } from '../../../core/services/mentor/mentor-session.service';
@Component({
  selector: 'app-mentors-sesstions',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent,FilterComponent],
  templateUrl: './mentors-sesstions.component.html',
  styleUrl: './mentors-sesstions.component.css'
})
export class MentorsSesstionsComponent implements OnInit {
  currentDateTime: Date = new Date();
  mentorServices = inject(MentorSessionService);
  userRoomService = inject(RoomService)
  mentor = JSON.parse(localStorage.getItem('MentorData') || '{}');
  user = JSON.parse(localStorage.getItem('userData') || '{}');
  router = inject(Router);  
  sessions: IMentorRoom[] = [];
  sessionAmount: number = 0;

  ngOnInit(): void {
    this.getAllSessions();
  }

  getAllSessions() {
    this.mentorServices.requestGetAllSessions().subscribe((res: any) => {
      this.sessions = res.rooms
        .filter((room: IMentorRoom) => room.createdAt)
        .map((room: IMentorRoom) => ({
          ...room,
          startTime: new Date(room.startTime), // Convert startTime to Date object
          endTime: new Date(room.endTime),     // Convert endTime to Date object
          createdAt: new Date(room.createdAt), // Convert createdAt to Date object
        }))
        .sort((a: IMentorRoom, b: IMentorRoom) => {
          return b.createdAt.getTime() - a.createdAt.getTime(); // Sort by createdAt
        });
    });
  }

  // Payment Integration Logic
  initiatePayment(session: IMentorRoom) {
    this.sessionAmount = session.bookingFee;
    const bookingFee = session.bookingFee * 100;
    const options = {
      key: 'rzp_test_htApscPSpx9Vqx',
      amount: bookingFee, 
      currency: 'INR',
      name: 'Mentor Booking',
      description: `Booking session with ${session.topic}`,
      image: 'https://example.com/your_logo', 
      handler: (response: any) => {
        this.verifyPayment(response, session.id,session.mentorId);
      },
      prefill: {
        name: this.user.name,
        email: this.user.email,
        contact: this.user.phone,
      },
      notes: {
        sessionId: session.id,
        

      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new Razorpay(options);
    paymentObject.open();
  }

  // Payment Verification Logic
  verifyPayment(response: any, sessionId: string,mentorId:string) {
   
    const transactionData: ITransaction = {
      userId: this.user.id,
      mentorId:mentorId ,
      fundReceiverId:platFormId,
      amount: this.sessionAmount,
      type: "Session Booking",
      status:IStatus.CREDITED,
      transactionId: response.razorpay_payment_id || null,
      paymentMethod: "Razorpay",
      sessionId: sessionId,
      description: `Payment for session: ${sessionId}`,
    };
    console.log(transactionData);
    this.userRoomService.requestVerifyPayment(transactionData).subscribe(
      (response) => {
        console.log('Payment verification successful:', response.message);
        this.getAllSessions();
      },
      (error) => {
        console.error('Error verifying payment:', error);
      }
    )

}

joinSession(roomId: any) {
  this.router.navigate([`/user/room/${roomId}`]);
}
}
