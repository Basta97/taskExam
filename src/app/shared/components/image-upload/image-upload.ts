import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUploadComponent {
  private readonly uploadService = inject(UploadService);

  @Input() currentImage = '';
  @Input() label = 'Upload Image';
  @Output() imageUploaded = new EventEmitter<string>();

  preview: string | null = null;
  uploading = false;
  error = '';
  dragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.uploadFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.uploadFile(file);
  }

  private uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select an image file';
      return;
    }
    this.uploading = true;
    this.error = '';
    this.preview = URL.createObjectURL(file);

    this.uploadService.upload(file).subscribe({
      next: (res: any) => {
        this.uploading = false;
        const url = res?.payload?.url || res?.url || res?.data?.url;
        if (url) {
          this.imageUploaded.emit(url);
        } else {
          this.error = 'Upload succeeded but no URL returned';
        }
      },
      error: (err: any) => {
        this.uploading = false;
        this.preview = null;
        this.error = err.error?.message || 'Upload failed';
      },
    });
  }
}
