import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() visible = false;
  @Output() dismiss = new EventEmitter<void>();

  onClose() {
    this.dismiss.emit();
  }
}
