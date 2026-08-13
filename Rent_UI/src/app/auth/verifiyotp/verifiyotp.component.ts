import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifiyotp',
  templateUrl: './verifiyotp.component.html',
  styleUrls: ['./verifiyotp.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class VerifiyotpComponent implements OnInit {
  otp: string[] = ['', '', '', '', '', ''];

  email = localStorage.getItem('email'); // Email saved during signup


  @ViewChildren('otpInput') otpInputs!: QueryList<IonInput>;

onInput(event: any, index: number) {
  const value = (event.detail.value || '').replace(/\D/g, '');

  this.otp[index] = value.substring(0, 1);

  if (this.otp[index] && index < this.otp.length - 1) {
    this.otpInputs.toArray()[index + 1].setFocus();
  }
}

async onPaste(event: ClipboardEvent) {
  event.preventDefault();

  const pasted = event.clipboardData
    ?.getData('text')
    .replace(/\D/g, '')
    .slice(0, 6);

  if (!pasted) return;

  const inputs = this.otpInputs.toArray();

  for (let i = 0; i < pasted.length; i++) {
    this.otp[i] = pasted[i];
    inputs[i].value = pasted[i];
  }

  if (pasted.length < 6) {
    await inputs[pasted.length].setFocus();
  } else {
    await inputs[5].setFocus();
  }
}
trackByIndex(index: number): number {
  return index;
}
onKeyDown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace') {
    if (!this.otp[index] && index > 0) {
      this.otpInputs.toArray()[index - 1].setFocus();
    }
  }
}
 
  constructor(
    private api: ApiService,
    private toast: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}
  verifyOtp() {
    const otp = this.otp.join('');

    if (otp.length !== 6) {
      this.showToast('Please enter a valid OTP');
      return;
    }

    const body = {
      email: this.email,
      otp: otp,
    };

    this.api.VerifyAccount(body).subscribe({
      next: async (res: any) => {
        console.log(res);

        await this.showToast('OTP Verified Successfully');

        // Navigate to Login page
       this.router.navigate(['/login']);
      },
      error: async (err) => {
        console.log(err);

        await this.showToast(err.error?.message || 'Invalid OTP');
      },
    });
  }

  // resendOtp() {

  //   this.api.resendOtp({
  //     email: this.email
  //   }).subscribe({
  //     next: () => {
  //       this.showToast('OTP Sent Successfully');
  //     },
  //     error: () => {
  //       this.showToast('Unable to resend OTP');
  //     }
  //   });

  // }

  async showToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'bottom',
    });

    toast.present();
  }
}
