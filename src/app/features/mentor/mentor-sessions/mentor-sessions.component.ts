import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MentorProfileService } from '../../../core/services/mentor/mentor-profile.service';
import { IMentorRoom, IReshedulement } from '../../../shared/models/mentorform.model';
import { Router } from '@angular/router';
import { MentorSessionService } from '../../../core/services/mentor/mentor-session.service';
import { RoomService } from '../../../core/services/user/room.service';

@Component({
  selector: 'app-mentor-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mentor-sessions.component.html',
  styleUrls: ['./mentor-sessions.component.css']
})
export class MentorSessionsComponent implements OnInit {
  currentDateTime = new Date();

  isModalOpen = false;
  isRescheduleModalOpen = false;
  sessionForm: FormGroup;
  rescheduleForm: FormGroup;
  currentSessionId: string | null = null;
  mentor: any = {};
  sessions: IMentorRoom[] = [];
  paginatedSessions: IMentorRoom[] = [];
  mentorServices = inject(MentorSessionService);
  userRoomServices = inject(RoomService);
  router = inject(Router);

  // Pagination variables
  currentPage = 1;
  sessionsPerPage = 5;

  constructor(private fb: FormBuilder) {
    this.sessionForm = this.fb.group({
      language: ['', Validators.required],
      topic: ['', Validators.required],
      limit: [1, [Validators.required, Validators.min(1)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      bookingFee: [0, [Validators.required, Validators.min(0)]],
    });

    this.rescheduleForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    const mentorData = localStorage.getItem('mentorData');
    this.mentor = mentorData ? JSON.parse(mentorData) : {};
    this.getAllSessions();
  }

  getAllSessions() {
    this.mentorServices.requestGetAllSessions().subscribe({
      next: (res) => {
        if (Array.isArray(res?.mentorRooms)) {
          this.sessions = res.mentorRooms.map(session => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime),
          }));
          this.updatePaginatedSessions();
        } else {
          console.error('mentorRooms not available:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching sessions:', err);
        alert('Error fetching your sessions. Please try again later.');
      }
    });
  }

  updatePaginatedSessions() {
    const startIndex = (this.currentPage - 1) * this.sessionsPerPage;
    const endIndex = startIndex + this.sessionsPerPage;
    this.paginatedSessions = this.sessions.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedSessions();
    }
  }

  getTotalPages() {
    return Math.ceil(this.sessions.length / this.sessionsPerPage);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.sessionForm.reset();
  }

  createSession() {
    if (this.sessionForm.valid) {
      const data = this.sessionForm.value;
      data.startTime = new Date(data.startTime).toISOString();
      data.endTime = new Date(data.endTime).toISOString();
      data.mentorId = this.mentor.id;

      const roomData: IMentorRoom = data;
      this.mentorServices.requestCreateSession(roomData).subscribe({
        next: () => {
          this.getAllSessions();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating session:', err);
          alert('Failed to create session. Please try again.');
        }
      });
    } else {
      this.sessionForm.markAllAsTouched();
    }
  }

  joinSession(id: string) {
    this.userRoomServices.setMemberType("MENTOR");
    this.router.navigate([`/mentor/mentorRoom/${id}`]);
  }

  rescheduleSession(id: string) {
    this.currentSessionId = id;
    this.isRescheduleModalOpen = true;
  }

  closeRescheduleModal(): void {
    this.isRescheduleModalOpen = false;
    this.rescheduleForm.reset();
    this.currentSessionId = null;
  }

  submitReschedule() {
    if (this.rescheduleForm.valid && this.currentSessionId) {
      const data = this.rescheduleForm.value;
      data.startTime = new Date(data.startTime).toISOString();
      data.endTime = new Date(data.endTime).toISOString();
      data.roomId = this.currentSessionId;

      this.mentorServices.requestResheduleSession(data).subscribe({
        next: () => {
          this.getAllSessions();
          this.closeRescheduleModal();
        },
        error: (err) => {
          console.error('Error rescheduling session:', err);
          alert('Rescheduling failed. Please try again.');
        }
      });
    } else {
      this.rescheduleForm.markAllAsTouched();
    }
  }

  cancelSession(id: string) {
    this.mentorServices.requestCancelSession(id, this.mentor.id).subscribe({
      next: (res: any) => {
        console.log(res.message);
        this.getAllSessions();
      },
      error: (err) => {
        console.error('Error cancelling session:', err);
        alert('Unable to cancel session.');
      }
    });
  }
}
