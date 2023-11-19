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

  addNewTab(formData: FormData) {
    const headers = getAuthHeaders();
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
          this.collChapters.sort((a, b) => {
            if (a['order_num'] > b['order_num']) {
              return 1
            }
            if (a['order_num'] < b['order_num']) {
              return -1
            }
            return 0
          })
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
