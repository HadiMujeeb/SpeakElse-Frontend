import { Component } from '@angular/core';
interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  isFriend: boolean;
  canCall: boolean;
}
@Component({
  selector: 'app-chatbar',
  standalone: true,
  imports: [],
  templateUrl: './chatbar.component.html',
  styleUrl: './chatbar.component.css'
})
export class ChatbarComponent {
  users: User[] = [
    {
      id: 1,
      name: 'Akhil',
      avatar: 'assets/avatars/akhil.jpg',
      isOnline: true,
      isFriend: true,
      canCall: true
    },
    {
      id: 2,
      name: 'Usman Ali',
      avatar: 'assets/avatars/usman.jpg',
      isOnline: true,
      isFriend: true,
      canCall: true
    },
    {
      id: 3,
      name: 'Hrithu',
      avatar: 'assets/avatars/hrithu.jpg',
      isOnline: true,
      isFriend: false,
      canCall: false
    },
    {
      id: 4,
      name: 'ARUN',
      avatar: 'assets/avatars/arun.jpg',
      isOnline: true,
      isFriend: false,
      canCall: false
    },
    {
      id: 5,
      name: 'UNIQUE',
      avatar: '',
      isOnline: true,
      isFriend: false,
      canCall: false
    }
  ];
}
