import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../layouts/user/header/header.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { MentorSessionService } from '../../../core/services/mentor/mentor-session.service';
import { IMentorRoom } from '../../../shared/models/mentorform.model';
import { Router } from '@angular/router';
import { RoomService } from '../../../core/services/user/room.service';
import { IStatus, ITransaction } from '../../../shared/models/friendsRating.model';
import { platFormId } from '../../../../environment/environment.development';

@Component({
  selector: 'app-mentors-sesstions',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FilterComponent],
  templateUrl: './mentors-sesstions.component.html',
  styleUrl: './mentors-sesstions.component.css'
})
export class MentorsSesstionsComponent implements OnInit {
  currentDateTime: Date = new Date();
  mentorServices = inject(MentorSessionService);
  userRoomService = inject(RoomService);
  router = inject(Router);
  
  mentor = JSON.parse(localStorage.getItem('MentorData') || '{}');
  user = JSON.parse(localStorage.getItem('userData') || '{}');

  sessions: IMentorRoom[] = [];
  paginatedSessions: IMentorRoom[] = [];
  sessionAmount: number = 0;
  BsessionId=''

  // Pagination variables
  page: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  ngOnInit(): void {
    this.getAllSessions();
  }

  getAllSessions() {
    this.mentorServices.requestGetAllSessions().subscribe((res) => {
      this.sessions = res.mentorRooms
        .filter((room: IMentorRoom) => room.createdAt)
        .map((room: IMentorRoom) => ({
          ...room,
          startTime: new Date(room.startTime),
          endTime: new Date(room.endTime),
          createdAt: new Date(room.createdAt),
        }))
        .sort((a: IMentorRoom, b: IMentorRoom) => b.createdAt.getTime() - a.createdAt.getTime());

      this.totalPages = Math.ceil(this.sessions.length / this.pageSize);
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePaginatedSessions();
    });
  }

  updatePaginatedSessions(): void {
    console.log("working..................")
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedSessions = this.sessions.slice(start, end);
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.updatePaginatedSessions();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePaginatedSessions();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedSessions();
    }
  }

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
        this.verifyPayment(response, session.id, session.mentorId);
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

  verifyPayment(response: any, sessionId: string, mentorId: string) {
    const transactionData: ITransaction = {
      userId: this.user.id,
      mentorId: mentorId,
      fundReceiverId: platFormId,
      amount: this.sessionAmount,
      type: 'Session Booking',
      status: IStatus.CREDITED,
      transactionId: response.razorpay_payment_id || null,
      paymentMethod: 'Razorpay',
      sessionId: sessionId,
      description: `Payment for session: ${sessionId}`,
    };
     this.BsessionId = sessionId
    this.userRoomService.requestVerifyPayment(transactionData).subscribe({
      
      next:(response) => {
        console.log('Payment verification successful:', response.message);
        setTimeout(()=>{
      this.sessions = this.sessions.map((session) => {
        if (session.id === this.BsessionId) {
          // Avoid duplicate push
          if (!session.participants.includes(this.user.id)) {
            return {
              ...session,
              participants: [...session.participants, this.user.id]
            };
          }
        }
        return session;
      });
      
      this.updatePaginatedSessions();
        },6000)
       
      },
      error:(error) => {
        console.error('Error verifying payment:', error);
      }
  });
  }

  joinSession(roomId: any) {
    this.userRoomService.setMemberType('USER');
    this.router.navigate([`mentor/mentorRoom/${roomId}`]);
  }
}
