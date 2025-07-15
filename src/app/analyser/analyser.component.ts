import { Component } from '@angular/core';
import { AnalyserService } from '../services/analyser.service';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analyser',
  templateUrl: './analyser.component.html',
  imports: [CommonModule],
  styleUrls: ['./analyser.component.css']
})
export class AnalyserComponent {
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  result = '';
  errorMessage = '';

  constructor(private analyserService: AnalyserService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadProgress = 0;
    this.result = '';
    this.errorMessage = '';
  }

  upload() {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';

    this.analyserService.uploadFile(this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total ?? 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          this.result = (event.body as any).result || 'No result returned';
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = 'Upload failed. Please try again.';
        console.error(err);
      }
    });
  }
}
