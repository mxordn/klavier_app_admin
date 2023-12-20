import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '../models/user';
import { HOST } from '../config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  register_form: FormGroup;
  recovery_form: FormGroup;

  constructor(private fB: FormBuilder,
              private router: Router,
              private hC: HttpClient) {
    this.register_form = this.fB.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.recovery_form = this.fB.group({
      email_recovery: new FormControl('', Validators.email)
    });
  }

  register() {
    if (this.register_form.valid) {
      let register_form_data: FormData = new FormData();
      register_form_data.append('username', this.register_form.value.username);
      register_form_data.append('email', this.register_form.value.email);
      register_form_data.append('firstname', this.register_form.value.firstname);
      register_form_data.append('lastname', this.register_form.value.lastname);
      register_form_data.append('password', this.register_form.value.password);

      this.hC.post<UserModel>(HOST + '/user/register', register_form_data).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          alert('Benutzer erfolgreich registriert. Bitte melden Sie sich an.');
          this.router.navigate(['']);
        }
      });
    } else {
      alert('Bitte alle Felder ausfüllen');
    }
  }

  recovery() {
    let recovery_form_data = new FormData()
    recovery_form_data.append('email', this.recovery_form.value.email_recovery);
    this.hC.post(HOST + '/user/recover_password', recovery_form_data).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
