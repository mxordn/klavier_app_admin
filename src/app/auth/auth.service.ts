import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmptyColl } from '../models/collection';
import { HOST } from '../config';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CollectionService } from '../collection.service';

interface jwtData {
  user_id: string,
  exp: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwt_usertoken: string = '';
  user_logged_in: Boolean = false;

  constructor(private hC: HttpClient,
               private router: Router,
               private collService: CollectionService) { }

  login_user(formData: FormData) {
    this.hC.post(HOST + '/user/login', formData).subscribe({
      next: (data) => {
        console.log(data);
        if (data) {
          this.jwt_usertoken = data.toString();
          const dec: jwtData = jwtDecode(this.jwt_usertoken);
          localStorage.setItem("user_id", dec.user_id);
          localStorage.setItem("exp", dec.exp);
          localStorage.setItem('token', this.jwt_usertoken)
        } else {
          alert("Etwas ist schiefgegangen.")
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log("Complete!");
        console.log(this.is_token_valid());

        if (this.is_token_valid()) {
          this.user_logged_in = true;
          this.collService.getUserCollections();
          this.router.navigate(["user_home"]);
        }
      }
    })
  }

  logout_user() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('exp');
    localStorage.removeItem('token');
    this.collService.collections = [];
    this.collService.selectedColl = EmptyColl;
    this.user_logged_in = false;
  }

  is_token_valid(): Boolean {
    let curr_date = new Date().getTime();
    let token_exp = Number(localStorage.getItem("exp")!) * 1000;

    console.log(localStorage.getItem("exp"), Number(token_exp) * 1000, curr_date);
    if (Number(token_exp) > curr_date) {
      return true
    } else {
      return false
    }
  }
}
