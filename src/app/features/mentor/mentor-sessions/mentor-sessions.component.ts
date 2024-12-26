import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MentorProfileService } from '../../../core/services/mentor/mentor-profile.service';
import { IMentorRoom, IReshedulement } from '../../../shared/models/mentorform.model';
import { Router } from '@angular/router';
import { MentorSessionService } from '../../../core/services/mentor/mentor-session.service';

@Component({
  selector: 'app-mentor-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mentor-sessions.component.html',
  styleUrls: ['./mentor-sessions.component.css']
})
export class MentorSessionsComponent implements OnInit {
  currentDateTime: Date = new Date();
  isModalOpen = false;
  isRescheduleModalOpen = false;
  sessionForm: FormGroup;
  rescheduleForm: FormGroup;
  currentSessionId: string | null = null;
  mentor: any;
  mentorServices = inject(MentorSessionService);
  router = inject(Router);
  
  sessions: IMentorRoom[] = [];

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
    this.mentor = JSON.parse(localStorage.getItem('mentorData') || '{}');
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
      console.log(this.sessions);
    });
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
      this.mentorServices.requestCreateSession(roomData).subscribe(() => {
        this.getAllSessions();
        this.closeModal();
      });
    } else {
      this.sessionForm.markAllAsTouched();
    }
  }

  joinSession(id: string) {
    this.router.navigate([`/mentor/room/${id}`]);
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
    this.isRescheduleModalOpen = true;
    if (this.rescheduleForm.valid) {
      const data = this.rescheduleForm.value;
      data.startTime = new Date(data.startTime).toISOString();
      data.endTime = new Date(data.endTime).toISOString();
      data.roomId = this.currentSessionId || '';
      this.mentorServices.requestResheduleSession(data).subscribe((res: any) => {
        this.getAllSessions();
        this.closeRescheduleModal();
      }, (err) => console.log(err));
    } else {
      this.rescheduleForm.markAllAsTouched();
    }
  }

  cancelSession(id: string) {
    this.mentorServices.requestCancelSession(id, this.mentor.id).subscribe((res: any) => {
      console.log(res.message);
      this.getAllSessions();
    }, (err) => console.log(err));
  }

  
}
