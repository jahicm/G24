import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
   standalone: true,         
  imports: [FormsModule,CommonModule],   // 👈
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
 
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    
      this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/base']),
      error: () => this.errorMessage = 'Invalid username or password'
    });
  }
}
