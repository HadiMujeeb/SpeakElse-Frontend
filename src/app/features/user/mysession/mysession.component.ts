import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MentorSessionService } from '../../../core/services/mentor/mentor-session.service';
import { RoomService } from '../../../core/services/user/room.service';
import { IMentorRoom } from '../../../shared/models/mentorform.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mysession',
  standalone: true,
  templateUrl: './mysession.component.html',
  styleUrls: ['./mysession.component.css'],
  imports: [CommonModule],
})
export class MysessionComponent implements OnInit {
  user: any = (() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch (err) {
      console.error('Failed to parse userData from localStorage:', err);
      return {};
    }
  })();

  sessions: IMentorRoom[] = [];
  userSessions: IMentorRoom[] = [];
  currentDateTime: Date = new Date();
  sessionAmount: number = 0;

  constructor(
    private mentorSessionService: MentorSessionService,
    private roomService: RoomService,
    private router: Router
  ) {}
userRoomService = inject(RoomService);
  ngOnInit(): void {
    this.getUserSessions();
  }

  // Fetch all sessions and filter for the ones booked by the user
  getUserSessions() {
    this.mentorSessionService.requestGetAllSessions().subscribe({
      next: (res) => {
        const mentorRooms = res?.mentorRooms;

        if (!Array.isArray(mentorRooms)) {
          console.warn('mentorRooms is not an array:', mentorRooms);
          this.sessions = [];
          this.userSessions = [];
          return;
        }

        this.sessions = mentorRooms
          .map((room: IMentorRoom) => ({
            ...room,
            startTime: new Date(room.startTime),
            endTime: new Date(room.endTime),
          }))
          .filter(
            (session: IMentorRoom) =>
              Array.isArray(session.participants) &&
              session.participants.includes(this.user.id)
          );

        this.userSessions = this.sessions.sort(
          (a, b) => b.startTime.getTime() - a.startTime.getTime()
        );
      },
      error: (err) => {
        console.error('Error fetching sessions:', err);
        this.sessions = [];
        this.userSessions = [];
      },
    });
  }

  // Optional: If you want to implement session completion later
  markSessionComplete(session: IMentorRoom) {
    // this.mentorSessionService.updateSessionStatus(session.id, 'COMPLETED').subscribe(() => {
    //   console.log(`Session ${session.id} marked as completed`);
    //   this.getUserSessions(); // Refresh the session list after marking as completed
    // });
  }

  // Navigate user to the session room
  joinSession(roomId: string) {
    this.userRoomService.setMemberType('USER');
    this.router.navigate([`mentor/mentorRoom/${roomId}`]);
  }
}
