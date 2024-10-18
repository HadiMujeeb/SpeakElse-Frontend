import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-image',
  standalone: true,
  imports: [],
  templateUrl: './form-image.component.html',
  styleUrl: './form-image.component.css'
})
export class FormImageComponent {
  @Input() imageUrl: string="../assets/images/M151_Job Interview Illustrations on Yellow Images Creative Store - 68636.jpeg"
}
