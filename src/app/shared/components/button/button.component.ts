import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'] // Fixed from styleUrl to styleUrls
})
export class ButtonComponent {
  @Input() label: string = 'Button';  // Button label
  @Input() color: string = 'bg-purple-600';  // Background color
  @Input() textColor: string = 'text-white';  // Text color
  @Input() disabled: boolean = false;  // Disabled state
  @Output() clicked = new EventEmitter<void>();  // Click event

  // Emit the click event
  onClick() {
    if (!this.disabled) { // Prevent emitting if disabled
      this.clicked.emit();
    }
  }
}
