import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
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
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
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
    private fb: FormBuilder,
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
    const rememberedUser = localStorage.getItem('rememberUser');

    if (rememberedUser) {
      const user = JSON.parse(rememberedUser);

      this.email = user.email;
      this.password = user.password;
      this.rememberMe = true;
    } else {
      this.email = '';
      this.password = '';
      this.rememberMe = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  login() {
    if (!this.email || !this.password) {
      this.showToast('Please enter a valid email and password');
      return;
    }

    this.isLoading = true;

    const body = {
      email: this.email.trim(),
      password: this.password,
    };

    this.api.LoginUser(body).subscribe({
      next: async (res: any) => {
        this.isLoading = false;

        if (res.success) {
          // Login flag
          sessionStorage.setItem('isLoggedIn', 'true');

          // User data
          if (res.user) {
            sessionStorage.setItem('user', JSON.stringify(res.user));
          }

          // Remember Me
          if (this.rememberMe) {
            localStorage.setItem(
              'rememberUser',
              JSON.stringify({
                email: this.email,
                password: this.password,
              })
            );
          } else {
            localStorage.removeItem('rememberUser');
          }

          await this.showToast(res.message);

          this.router.navigateByUrl('/home', {
            replaceUrl: true,
          });
        } else {
          this.showToast(res.message);
        }
      },

      error: (err) => {
        this.isLoading = false;

        this.showToast(
          err.error?.message || 'Something went wrong'
        );
      },
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }
}