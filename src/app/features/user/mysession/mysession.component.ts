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
    this.mentorSessionService.requestGetAllSessions().subscribe((res) => {
      this.sessions = res.mentorRooms
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

  joinSession(roomId: string) {
    this.router.navigate([`/user/room/${roomId}`]);
  }
}
