import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChapterModel, EmptyChapter } from './models/chapter';
import { TabModel } from './models/tab';
import { FormGroup } from '@angular/forms';
import { getAuthHeaders } from './auth/auth.header';
import { HOST } from './models/collection';
import { CollectionService } from './collection.service';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  collChapters: ChapterModel[] = []
  selectedChapter: ChapterModel = EmptyChapter;
  addTabUrl: string = HOST + '/new_exercise';

  constructor(private hC: HttpClient) { }

  addNewTab(formGroup: FormGroup, chapter_id: string) {
    const headers = getAuthHeaders();

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

  deleteOneChapter(chap_id: string, coll_id: string) {
    if (this.selectedChapter.id === chap_id) {
      const headers = getAuthHeaders();
      this.hC.delete<ChapterModel[]>(HOST + "/delete_one_chapter/" + this.selectedChapter.id + '?coll_id=' + coll_id,
                                      {headers: headers}).subscribe({
        next: (response) => {
          console.log(response);
          this.collChapters = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('Collection deleted')
        }
      });
    } else {
      alert('Bitte öffnen Sie die Collection erneut.');
    }
  }
}
