import { Injectable } from '@angular/core';
import { EmptyTab, TabModel } from './models/tab';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { getAuthHeaders } from './auth/auth.header';
import { HOST } from './models/collection';
import { AuthService } from './auth/auth.service';
import { authGuard } from './auth/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  selectedTab: TabModel = EmptyTab;
  tabs: TabModel[] = [];

  selectedUploadURLImg: string = '';
  selectedUploadURLAudio: string = '';
  selectedUploadURLDescription: string = '';

  imgURL: BehaviorSubject<string>
  audioURL: BehaviorSubject<string>

  constructor(private hC: HttpClient) {
    this.imgURL = new BehaviorSubject('');
    this.audioURL = new BehaviorSubject('');
  }

  updateTabData(tab_data: TabModel) {
    this.tabs.forEach((t) => {
      if (t.id === tab_data.id) {
        t = tab_data;
        this.setSelectedTab(t.id);
        return
      }
    });
  }

  setSelectedTab(tab_id: string) {
    this.tabs.forEach((t) => {
      if (t.id === tab_id) {
        this.selectedTab = t;
        console.log('tab set +', tab_id, t, t.audio_url, t.img_url);
      }
    })
    this.updateURLs();
    //(this.selectedTab.img_url, "img");
    //this.updateURL(this.selectedTab.audio_url, "audio");
  }

  updateTabDescription(formTab: FormGroup) {
    if (formTab.valid) {
      let formData: FormData = new FormData();
      formData.append("tab_description", formTab.value.tab_description);
      formData.append("exercise_tab_name", formTab.value.exercise_tab_name);

      this.hC.post<TabModel>(this.selectedUploadURLDescription, formData).subscribe({
        next: (data) => {
          this.selectedTab = data;
          this.tabs.forEach((t) => {
            if (t.id === this.selectedTab.id) {
              t.exercise_description = this.selectedTab.exercise_description;
              t.exercise_tab_name = this.selectedTab.exercise_tab_name;
            }
          })
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('updated data tab:', this.selectedTab);
        }
      });
    }
  }

  updateURLs() {
    console.log('next: ', this.selectedTab.img_url, this.selectedTab.audio_url);
    this.imgURL.next(this.selectedTab.img_url);
    this.audioURL.next(this.selectedTab.audio_url);
  }

  updateURL(val: string, media_type: 'img' | 'audio') {
    console.log(this.selectedTab.audio_url, this.selectedTab.img_url)
    console.log("Update called", val, media_type)
    if (media_type === 'img') {
      this.imgURL.next(val);
    } else if (media_type === 'audio') {
      this.audioURL.next(val);
    }
  }
}
