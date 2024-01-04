import { HttpClient } from '@angular/common/http';
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

//Token needs to initialized in this context because setInterval runs outside the angular zone
export let renewTokenIntervalId = 0;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwt_usertoken: string = '';
  user_logged_in: boolean = false;

  constructor(private hC: HttpClient,
    private router: Router,
    private collService: CollectionService) { }
    
  login_user(formData: FormData) {
    this.hC.post(HOST + '/user/login', formData).subscribe({
      next: (data) => {
        // console.log(data);
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
        alert(err.status + ': ' + err.error.detail);
      },
      complete: () => {
        console.log("Complete!");
        // console.log(this.is_token_valid());
        
        if (this.is_token_valid()) {
          this.user_logged_in = true;
          this.collService.getUserCollections();
          this.router.navigate(["user_home"]);
        }
        renewTokenIntervalId = Number(setInterval(this.renewToken, 3300000));
        // console.log('ID', renewTokenIntervalId);
        //10000
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
    // console.log(renewTokenIntervalId);
    clearInterval(renewTokenIntervalId);
    // console.log(renewTokenIntervalId);
    this.router.navigate(['']);
  }
  
  is_token_valid(): Boolean {
    let curr_date = new Date().getTime();
    let token_exp = Number(localStorage.getItem("exp")!) * 1000;
    
    // console.log(localStorage.getItem("exp"), Number(token_exp) * 1000, curr_date);
    if (Number(token_exp) > curr_date) {
      return true
    } else {
      return false
    }
  }

  renewToken() {
    // console.log(renewTokenIntervalId);
    clearInterval(renewTokenIntervalId);
    alert('Die Sitzung läuft in 5 Minuten ab. Bitte erneuern Sie die Sitzung, indem Sie sich neu einloggen.');
  }
}
