import { Injectable } from '@angular/core';
import { EmptyTab, TabModel } from './models/tab';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { getAuthHeaders } from './auth/auth.header';
import { HOST } from './models/collection';

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
          console.log('data', this.selectedTab);
        }
      });
    }
  }

  updateURL(val: string, media_type: 'img' | 'audio') {
    if (media_type === 'img') {
      this.imgURL.next(val);
    } else if (media_type === 'audio') {
      this.audioURL.next(val);
    }
  }

  deleteOneTab(tab_id: string, chapter_id: string) {
    const headers = getAuthHeaders();
    const params = new HttpParams().append('chapter_id', chapter_id);
    if (this.selectedTab.id === tab_id) {
      this.hC.delete<TabModel[]>(HOST + '/delete_tab/' + this.selectedTab.id, {params: params, headers: headers}).subscribe({
        next: (res) => {
          console.log(res);
          this.tabs = res;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {

        }
      });
    }
  }
}
