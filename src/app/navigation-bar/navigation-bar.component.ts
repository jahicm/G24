import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navigation-bar',
  imports: [TranslateModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
