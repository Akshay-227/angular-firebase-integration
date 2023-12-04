import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, PhoneAuthProvider } from 'firebase/auth';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  constructor(
    public authService: AuthService
  ) { }

  singInWithGoogle() {
    this.authService.AuthLogin(new GoogleAuthProvider)
  }
  singInWithGitHub() {
    this.authService.AuthLogin(new GithubAuthProvider)
  }
  singInWithMicrosoft() {
    this.authService.AuthLogin(new OAuthProvider('microsoft.com'))
  }
  
  ngOnInit() { }
}
