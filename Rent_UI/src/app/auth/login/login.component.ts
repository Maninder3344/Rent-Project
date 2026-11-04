
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import {
  IonicModule,
  ToastController,
} from '@ionic/angular';

import {
  logoFacebook,
  logoGoogle,
  logoApple,
  mailOutline,
  lockClosedOutline,
  personOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';

import { addIcons } from 'ionicons';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
  ],
})
export class LoginPage {
  showPassword = false;
  isLoading = false;

  email = '';
  password = '';
  rememberMe = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private toastController: ToastController
  ) {
    addIcons({
      logoFacebook,
      logoGoogle,
      logoApple,
      mailOutline,
      lockClosedOutline,
      personOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  ionViewWillEnter() {
    try {
      const rememberedUser = localStorage.getItem('rememberUser');

      if (rememberedUser) {
        const user = JSON.parse(rememberedUser);

        this.email = user.email || '';
        this.password = user.password || '';
        this.rememberMe = true;
      } else {
        this.email = '';
        this.password = '';
        this.rememberMe = false;
      }
    } catch (error) {
      console.error('Could not load remembered user:', error);
      localStorage.removeItem('rememberUser');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }

  async login() {
    if (this.isLoading) {
      return;
    }

    if (!this.email.trim() || !this.password) {
      await this.showToast('Please enter your email and password');
      return;
    }

    this.isLoading = true;

    const body = {
      email: this.email.trim(),
      password: this.password,
    };

    console.log('Login API URL:', `${this.api.baseUrl}/LoginUser`);

    this.api.LoginUser(body).subscribe({
      next: async (res: any) => {
        console.log('Login response:', JSON.stringify(res));
        console.log('Login success:', res?.success);

        if (res?.success !== true) {
          this.isLoading = false;
          await this.showToast(res?.message || 'Login failed');
          return;
        }

        try {
          sessionStorage.setItem('isLoggedIn', 'true');

          if (res.user) {
            sessionStorage.setItem('user', JSON.stringify(res.user));
          }

          if (res.token) {
            sessionStorage.setItem('token', res.token);
          }

          if (this.rememberMe) {
            localStorage.setItem(
              'rememberUser',
              JSON.stringify({
                email: this.email.trim(),
                password: this.password,
              })
            );
          } else {
            localStorage.removeItem('rememberUser');
          }

          console.log(
            'Session login flag:',
            sessionStorage.getItem('isLoggedIn')
          );

          const navigated = await this.router.navigateByUrl('/home', {
            replaceUrl: true,
          });

          console.log('Navigation result:', navigated);
          console.log('Current route:', this.router.url);

          if (!navigated) {
            await this.showToast(
              'Login succeeded, but Home navigation was blocked'
            );
          }
        } catch (error) {
          console.error('Login handling error:', error);
          await this.showToast('An error occurred after login');
        } finally {
          this.isLoading = false;
        }
      },

      error: async (err: any) => {
        this.isLoading = false;

        console.error('Login HTTP status:', err.status);
        console.error('Login error:', err.error);

        await this.showToast(
          err.error?.message || 'Unable to log in. Please try again.'
        );
      },
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }
}
