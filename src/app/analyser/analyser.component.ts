import { Component } from '@angular/core';
import { AnalyserService } from '../services/analyser.service';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-analyser',
  templateUrl: './analyser.component.html',
  imports: [CommonModule, TranslateModule],
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
          if (event?.body) {
            this.result = typeof event.body === 'string' ? event.body : JSON.stringify(event.body, null, 2);
          } else {
            this.result = 'No response received from the server.';
          }
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
