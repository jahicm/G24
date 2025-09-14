import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FooterComponent } from "./footer/footer.component";
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'G24';
  showHeaderFooter = true;

  constructor(private translateService: TranslateService, private router: Router) {
    translateService.setDefaultLang("en");

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        this.showHeaderFooter = !url.startsWith('/login');
      });
  }
}
