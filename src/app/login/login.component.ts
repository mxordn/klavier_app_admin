import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { CollectionService } from '../collection.service';
import { MenuItem } from 'primeng/api/menuitem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup
  menu_items: MenuItem[] | undefined;
  is_logged_in: boolean = false;

  constructor(private fB: FormBuilder,
              private collService: CollectionService,
              private router: Router,
              public authService: AuthService) {
    this.loginForm = this.fB.group({
      username_email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required)
    });
    this.menu_items = [
      {label: 'Home – Öffentliche Sammlungen', routerLink: '/'},
      {label: 'Eigene Sammlungen', routerLink: 'user_home'},
      {label: 'Registrierung', routerLink: 'register_user'},
      {label: 'Impressum', routerLink: 'impressum'}
    ];
  }

  
  login(panel: OverlayPanel) {
    if (this.loginForm.valid) {
      let formData: FormData = new FormData();
      formData.append("username_email", this.loginForm.value.username_email);
      formData.append("password", this.loginForm.value.password);
      this.authService.login_user(formData);
      panel.hide();
    }
  }

  logout() {
    this.authService.logout_user();
    this.collService.chapters_activated.next(false);
  }

  navigate_pwd(panel: OverlayPanel) {
    this.router.navigate(['/reset_password']);
    panel.hide();
  }
}
