import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HOST } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  email_group: FormGroup;
  dialog_visible: boolean = false;
  // ut: string = '';
  // user_id: string = '';

  constructor(private hC: HttpClient,
             private router: Router,
             private fB: FormBuilder) {
    this.email_group = this.fB.group({
      email: new FormControl('', [Validators.email, Validators.required])
    });
  }

  init_reset() {
    if (this.email_group.valid) {
      const formData: FormData = new FormData();
      formData.append('email', this.email_group.value.email);
      this.hC.post(HOST + '/user/recover', formData).subscribe({
        next: (res) => {
          console.log(res);
          this.dialog_visible = true;
        },
        error: (err) => {
          console.log(err);
          alert('Email Adresse nicht gefunden.\n\n' + err.error.detail);
        },
        complete: () => {
          console.log('complete!');
        }
      })
    }
  }
  redirectToHome() {
    this.dialog_visible = false;
    this.router.navigate(['']);
  }
}
