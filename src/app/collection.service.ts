import { Injectable } from '@angular/core';
import { CollectionModel, EmptyColl, HOST } from './models/collection';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ChapterModel, EmptyChapter } from './models/chapter';
import { ChapterService } from './chapter.service';
import { TabService } from './tab.service';
import { EmptyTab, TabModel } from './models/tab';
import { getAuthHeaders } from './auth/auth.header';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  collections: CollectionModel[] = [];
  chapters_activated: Boolean = false
  selectedColl: CollectionModel = EmptyColl;
  selectedTab: TabModel = EmptyTab;
  
  constructor(private hC: HttpClient,
              private chapterService: ChapterService,
              private tabService: TabService) {}

  public getUserCollections(refresh: boolean=true) {
    let headers = new HttpHeaders()
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token') || '');
    console.log('LOG Header', headers.get('Authorization'))
    this.hC.get<CollectionModel[]>(HOST + "/get_user_collection/" + localStorage.getItem('user_id'),
                                    {headers: headers}).subscribe({
      next: (response) => {
        this.collections = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () =>{
        console.log(this.collections)
        // set selection with updated data.
        if (this.selectedColl != EmptyColl && refresh) {
          this.collections.forEach((c) => {
            if (c.id === this.selectedColl.id) {
              this.selectedColl = c;
              this.chapterService.collChapters = this.selectedColl.list_of_exercises;
              this.chapterService.collChapters.sort((a, b) => {
                if (a['order_num'] > b['order_num']) {
                  return -1
                } if (a['order_num'] < b['order_num']) {
                  return 1
                }
                return 0
              });
              this.selectedColl.list_of_exercises.forEach((chap) => {
                if (chap.id === this.chapterService.selectedChapter.id) {
                  this.chapterService.selectedChapter = chap;
                  this.chapterService.selectedChapter.exercise_ids.forEach((t) => {
                    if (t.id === this.tabService.selectedTab.id) {
                      this.tabService.selectedTab = t;
                      this.tabService.updateURL(t.img_url, 'img');
                      this.tabService.updateURL(t.audio_url, 'audio');
                      console.log(this.chapterService.selectedChapter, this.tabService.selectedTab)
                      return
                   }
                  });
                }
              });
              return
            }
          })
        } else if (this.selectedColl != EmptyColl && !refresh) {
          this.selectedColl = EmptyColl;
        }
      }
    })
  }

  addChapter(newChap: ChapterModel): void {
    this.selectedColl.list_of_exercises.push(newChap);
  }

  addNewTab(formData: FormData) {
    const headers = getAuthHeaders();
    this.hC.post<TabModel>(this.chapterService.addTabUrl, formData, {headers: headers}).subscribe({
      next: (data) => {
        console.log('Chapter', data);
        console.log(this.chapterService.selectedChapter);
        this.chapterService.selectedChapter.exercise_ids.push(data);
        console.log('Vergleich coll', this.selectedColl.list_of_exercises);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.tabService.tabs = this.chapterService.selectedChapter.exercise_ids;
        //this.tabService.setSelectedTab(this.tabService.tabs[this.tabService.tabs.length -1].id)
        this.selectedColl.list_of_exercises.forEach((chap) => {
        if (chap.id === this.chapterService.selectedChapter.id) {
          console.log("updated collService", chap.exercise_ids);

        }
      });
        //console.log('data', this.selectedChapter);
      }
    });
  }

  deleteOneTab(tab_id: string, chapter_id: string) {
    const headers = getAuthHeaders();
    const params = new HttpParams().append('chapter_id', chapter_id);
    if (this.selectedTab.id === tab_id) {
      this.hC.delete<TabModel[]>(HOST + '/delete_tab/' + this.selectedTab.id, {params: params, headers: headers}).subscribe({
        next: (res) => {
          console.log(res);
          this.tabService.tabs = res;
          this.chapterService.selectedChapter.exercise_ids = res;
          this.selectedTab = EmptyTab;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {

        }
      });
    }
  }

  deleteOneCollection(id: string): void {
    if (this.selectedColl.id === id) {
      const headers = getAuthHeaders();
      const params = new HttpParams().set("user_id", this.selectedColl.owner.toString());
      this.hC.delete<CollectionModel[]>(HOST + "/delete_one_collection/" + this.selectedColl.id,
                                      {params: params, headers: headers}).subscribe({
        next: (response) => {
          console.log(response);
          this.selectedColl = EmptyColl;
          this.getUserCollections(false);
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
