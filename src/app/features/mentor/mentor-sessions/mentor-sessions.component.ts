import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MentorProfileService } from '../../../core/services/mentor/mentor-profile.service';
import { IMentorRoom } from '../../../shared/models/mentorform.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentor-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mentor-sessions.component.html',
  styleUrls: ['./mentor-sessions.component.css']
})
export class MentorSessionsComponent implements OnInit {
  isModalOpen = false;
  sessionForm: FormGroup;
  mentorServices =inject(MentorProfileService);
  router = inject(Router);
  mentor = JSON.parse(localStorage.getItem('MentorData') || '{}');
  mentors = [
    {
      id: '1',
      name: 'John Doe',
      title: 'Expert in Web Development',
      description: 'I have 10 years of experience building modern web apps.',
      languages: ['English', 'Spanish'],
      rating: 4.8,
      reviews: 120,
      price: 50,
      image: 'https://via.placeholder.com/150',
    },
    // Add more mentor objects here
  ];

  sessions:IMentorRoom[] = [];

  constructor(private fb: FormBuilder) {
    this.sessionForm = this.fb.group({
      language: ['', Validators.required],
      topic: ['', Validators.required],
      limit: [1, [Validators.required, Validators.min(1)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      bookingFee: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.getAllSessions();
  }

  getAllSessions() {
    this.mentorServices.requestGetAllSessions(this.mentor.id).subscribe((res:any)=>{
      
      this.sessions = res.rooms
      .filter((room: IMentorRoom) => room.createdAt)
      .sort((a: IMentorRoom, b: IMentorRoom) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
      console.log(this.sessions);
      })
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
      const roomData:IMentorRoom=data
      this.mentorServices.requestCreateSession(roomData).subscribe(
        (response: any) => {
         this.getAllSessions();
          this.closeModal();
        }
      )
  }else{
    this.sessionForm.markAllAsTouched();
  }
}

joinSession(id: string) {
  this.router.navigate([`/mentor/room/${id}`]);
  }

  // sendMessage(mentorId: string) {
   
  // }
}
