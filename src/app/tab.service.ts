import { Injectable } from '@angular/core';
import { EmptyTab, TabModel } from './models/tab';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  selectedTab: TabModel = EmptyTab;
  tabs!: TabModel[]

  selectedUploadURLImg: string = '';
  selectedUploadURLAudio: string = '';
  selectedUploadURLDescription: string = '';

  constructor(private hC: HttpClient) { }

  updateTabDescription(formTab: FormGroup) {
    if (formTab.valid) {
      let formData: FormData = new FormData();
      formData.append("tab_description", formTab.value.tab_description);
      this.hC.post<TabModel>(this.selectedUploadURLDescription, formData).subscribe({
        next: (data) => {
          console.log(data);
          console.log(this.selectedTab);
          this.selectedTab = data;
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
}
