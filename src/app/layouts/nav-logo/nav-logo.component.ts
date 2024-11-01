import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-logo',
  standalone: true,
  imports: [],
  templateUrl: './nav-logo.component.html',
  styleUrl: './nav-logo.component.css'
})
export class NavLogoComponent {
@Input() logoSrc:string = '../assets/images/letter-s (1).png';
@Input() platformName:string ='SpeakElse';
}
