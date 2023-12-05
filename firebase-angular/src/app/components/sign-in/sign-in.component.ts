import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, PhoneAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  emailOrPhone: string = '';
  password: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  disableSubmit: boolean
  loading = false;
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  isButtonDisabled(): boolean {
    if (this.isPhoneSignup()) {
      // For phone signup, enable the button if a valid phone number is entered
      return !/^\+\d+$/.test(this.emailOrPhone);
    } else {
      // For email signup, enable the button if both email and password are entered
      return !(this.emailOrPhone && this.password);
    }
  }
  verifyOtp() {
    this.loading = true
    this.disableSubmit = true
    this.authService.verifyOtp(this.otp)
      .then(response => {
        console.log('OTP verified successfully', response);
        this.router.navigate(['/dashboard']);
      })
      .catch(error => console.error('Error verifying OTP', error)).finally(() => { this.disableSubmit = false; this.loading = false });;
  }

  isPhoneSignup(): boolean {
    // Use a simple check to determine if the input looks like a phone number
    return /^\+\d+$/.test(this.emailOrPhone);
  }
  singInWithGoogle() {
    this.authService.AuthLogin(new GoogleAuthProvider)
  }
  singInWithGitHub() {
    this.authService.AuthLogin(new GithubAuthProvider).then(() => {
      this.router.navigate(['/dashboard']);
    })
  }
  singInWithMicrosoft() {
    this.authService.AuthLogin(new OAuthProvider('microsoft.com'))
  }

  signInOrSendOTP() {
    if (this.isPhoneSignup()) {
      // Handle phone signup
      this.disableSubmit = true
      this.loading = true
      this.authService.sendOtp(this.emailOrPhone)
        .then(() => {
          this.isOtpSent = true;
        })
        .catch(error => console.error('Error sending OTP', error)).finally(() => { this.disableSubmit = false; this.loading = false }
        );
    } else {
      // Handle email/password signup
      this.disableSubmit = true
      this.loading = true
      this.authService.SignIn(this.emailOrPhone, this.password)
        .then(response => {
          console.log('Signed up successfully', response);
          // Optionally, you can redirect the user to the dashboard or login page
        })
        .catch(error => console.error('Error signing up', error)).finally(() => { this.disableSubmit = false; this.loading = false }
        );
    }
  }

  ngOnInit() { }
}
