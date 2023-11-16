import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChapterModel, EmptyChapter } from './models/chapter';
import { TabModel } from './models/tab';
import { FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  selectedChapter: ChapterModel = EmptyChapter;
  addTabUrl: string = '';

  constructor(private hC: HttpClient,
              private authService: AuthService) { }

  addNewTab(formGroup: FormGroup, chapter_id: string) {
    const headers = this.authService.getAuthHeaders();

    let formData: FormData = new FormData();
    console.log('FG', formGroup, formData);
    formData.append("exercise_tab_name", formGroup.value.exercise_tab_name.toString());
    formData.append("icon", formGroup.value.icon.toString());
    formData.append("exercise_description", formGroup.value.exercise_description.toString());
    formData.append("chap_id", chapter_id);
    console.log(formData.get('icon'));
    this.hC.post<TabModel>(this.addTabUrl, formData, {headers: headers}).subscribe({
      next: (data) => {
        console.log('Chapter', data);
        console.log(this.selectedChapter);
        this.selectedChapter.exercise_ids.push(data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('data', this.selectedChapter);
      }
    });
  }
}
