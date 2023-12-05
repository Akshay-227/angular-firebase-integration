import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  emailOrPhone: string = '';
  password: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  disableSubmit: boolean
  loading = false;
  constructor(
    public authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar
  ) { }
  ngOnInit() { }

  isButtonDisabled(): boolean {
    if (this.isPhoneSignup()) {
      // For phone signup, enable the button if a valid phone number is entered
      return !/^\+\d+$/.test(this.emailOrPhone);
    } else {
      // For email signup, enable the button if both email and password are entered
      return !(this.emailOrPhone && this.password);
    }
  }
  signUpOrSendOTP() {
    if (this.isPhoneSignup()) {
      // Handle phone signup
      this.disableSubmit = true
      this.loading = true
      this.authService.sendOtp(this.emailOrPhone)
        .then(() => {
          this.isOtpSent = true;
          this.snackBar.open("OTP has been sent your mobile. Please Verify to continue !!", "Ok")
        })
        .catch(error => {
          this.snackBar.open(error?.error?.message || "Something went wrong. Please try again later.", "Ok")
        }).finally(() => { this.disableSubmit = false; this.loading = false }
        );
    } else {
      // Handle email/password signup
      this.disableSubmit = true
      this.loading = true
      this.authService.SignUp(this.emailOrPhone, this.password)
        .then(response => {
          console.log(response)
          this.snackBar.open("Successfully Signed Up!!", "Ok")
          // Optionally, you can redirect the user to the dashboard or login page
        })
        .catch(error => {
          this.snackBar.open(error?.error?.message || "Something went wrong. Please try again later.", "Ok")
        }).finally(() => { this.disableSubmit = false; this.loading = false }
        );
    }
  }

  verifyOtp() {
    this.loading = true
    this.disableSubmit = true
    this.authService.verifyOtp(this.otp)
      .then(response => {
        this.snackBar.open("OTP Verified !!", "Ok")
        this.router.navigate(['/dashboard']);
      })
      .catch(error => this.snackBar.open(error?.error?.message || "Something went wrong. Please try again later.", "Ok")
      ).finally(() => { this.disableSubmit = false; this.loading = false });
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

}