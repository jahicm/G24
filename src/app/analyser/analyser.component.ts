import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AnalyserService } from '../services/analyser.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-analyser',
  imports: [CommonModule],
  templateUrl: './analyser.component.html',
  styleUrl: './analyser.component.css'
})
export class AnalyserComponent {
  selectedFile: File | null = null;
  result: string = " "

  constructor(private analyserService: AnalyserService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {

    if (this.selectedFile) {
      this.analyserService.uploadFile(this.selectedFile).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            // Handle upload progress
            const percentDone = Math.round((event.loaded / event.total!) * 100);
            console.log(`File is ${percentDone}% uploaded.`);
          } else if (event.type === HttpEventType.Response) {
            // Handle response from the server
            this.result = (event.body as any).result || 'No result returned';
            console.log('Upload complete:', this.result);
          }
        },
        error: (err) => {
          console.error('Upload failed:', err);
          alert('An error occurred while uploading the file. Please try again.');
        }
      });
    } else {
      console.warn('No file selected for upload.');
    }
  }
}
