import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  shieldCheckmarkOutline,
  personOutline,
  mailOutline,
  callOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api'; // adjust path

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SignupComponent implements OnInit {
  showPassword = false;
  showConfirmPassword = false;

  // Form Model
  user = {
    name: '',
    email: '',

    password: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private api: ApiService,
  ) {
    addIcons({
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'call-outline': callOutline,
      'lock-closed-outline': lockClosedOutline,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  signup(): void {
    if (!this.user.name) {
      alert('Please enter your name');
      return;
    }

    if (!this.user.email) {
      alert('Please enter your email');
      return;
    }

    if (!this.user.password) {
      alert('Please enter your password');
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log(this.user);

    // TODO: Call your Signup API here

    const payload = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
    };
    console.log('Payload:', payload);
    this.api.RegisterUser(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.success) {
          // Save token if available
          if (res.token) {
            localStorage.setItem('token', res.token);
          }

          // Save email
          localStorage.setItem('email', this.user.email);
          alert('Registration Successful');

          this.router.navigate(['/verifiyotp'], {
            queryParams: { email: this.user.email },
          });
        } else {
          // Registration failed
          alert(res.message || 'Registration Failed');
        }
      },

      error: (err) => {
        console.error(err);

        alert(err.error?.message || 'Registration Failed');
      },
    });
  }
}
