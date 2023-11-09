import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup

  constructor(private fB: FormBuilder,
              public authService: AuthService) {
    this.loginForm = this.fB.group({
      username_email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required)
    })
  }

  
  login() {
    if (this.loginForm.valid) {
      let formData: FormData = new FormData();
      formData.append("username_email", this.loginForm.value.username_email);
      formData.append("password", this.loginForm.value.password);
      this.authService.login_user(formData);
    }
  }

  logout() {
    this.authService.logout_user();
  }
}
