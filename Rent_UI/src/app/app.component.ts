import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { PreloaderComponent } from './services/preloader/preloader.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, PreloaderComponent],
})
export class AppComponent {
  isLoading = true;
  constructor() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        // Add your HTTP interceptors here if needed
      ]),
    ),
  ],
};
