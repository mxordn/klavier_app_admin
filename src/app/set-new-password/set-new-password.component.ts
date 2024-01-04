import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HOST } from '../config';
import { getAuthHeaders } from '../auth/auth.header';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit {
  set_pwd_group: FormGroup;
  ut: string = '';
  user_id: string = '';
  dialog_set_done_visible: boolean = false;
  msg_text: string = '';
  success: boolean = false;

  constructor(private hC: HttpClient,
              private fB: FormBuilder,
              private dialogService: DialogService,
              private router: Router,
              private route: ActivatedRoute) {
    this.set_pwd_group = this.fB.group({
      e_mail: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      new_password_repeat: new FormControl('', Validators.required),
    });
  }
  
  ngOnInit() {
    this.ut = this.route.snapshot.queryParams['ut'];
    this.user_id = this.route.snapshot.params['user_id'];
    // console.log(this.ut, this.user_id);
  }

  set_pwd() {
    if (this.set_pwd_group.valid) {
      if (this.set_pwd_group.value.new_password === this.set_pwd_group.value.new_password_repeat) {
        const pw_form = new FormData();
        pw_form.append('e_mail', this.set_pwd_group.value.e_mail);
        pw_form.append('new_password', this.set_pwd_group.value.new_password);
        pw_form.append('user_id', '')
        // pw_form.append('ut', '')
        this.hC.post(HOST + '/user/set_new_password/' + this.user_id
                      + '?ut=' + this.ut, pw_form).subscribe({
          next: (res) => {
            console.log(res);
            this.success = true;
          },
          error: (err) => {
            console.log(err);
            if (err.error.detail === 'token not valid') {
              console.log('token')
              this.success = false;
              this.msg_text = 'Passwort konnte nicht geändert werden, da die Authentifizierung nicht geklappt hat. Evtl. ist die Anfrage abgelaufen gewesen.'
              this.dialog_set_done_visible = true;
            }
          },
          complete: () => {
            this.msg_text = 'Das Passwort wurde erfolreich geändert. Bitte loggen Sie sich neu ein.'
            this.dialog_set_done_visible = true;
            console.log('complete')
          }
        });
      }
    }
  }

  redirectToHome() {
    this.dialog_set_done_visible = false;
    if (this.success) {
      this.router.navigate(['']);
    }
  }
}
