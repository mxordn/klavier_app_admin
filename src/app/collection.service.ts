import { Injectable } from '@angular/core';
import { CollectionModel, EmptyColl } from './models/collection';
import { CourseModel, EmptyCourse } from './models/course';
import { HOST } from './config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChapterModel, EmptyChapter } from './models/chapter';
import { EmptyTab, TabModel } from './models/tab';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  courses: CourseModel[] = [];
  collections: CollectionModel[] = [];
  course_activated: BehaviorSubject<boolean>;
  chapters_activated: BehaviorSubject<boolean>;
  selectedColl: CollectionModel = EmptyColl;
  selectedChapter: ChapterModel = EmptyChapter;
  selectedCourse: CourseModel = EmptyCourse;
  selectedTab: TabModel = EmptyTab;
  collChapters: ChapterModel[] = [];

  currentImgURL: BehaviorSubject<string>
  currentAudioURL: BehaviorSubject<string>
  selectedUploadURLAudio = HOST + '/upload/media/audio/';
  selectedUploadURLImg = HOST + '/upload/media/img/';
  //selectedUploadURLDescription = HOST + '/upload/description/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user;
        

  
  constructor(private hC: HttpClient) {
    this.currentAudioURL = new BehaviorSubject('');
    this.currentImgURL = new BehaviorSubject('');
    this.chapters_activated = new BehaviorSubject(false);
    this.course_activated = new BehaviorSubject(false);
  }

  public getUserCollections(refresh: boolean=true) {
    let headers = new HttpHeaders()
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token') || '');
    // console.log('LOG Header', headers.get('Authorization'))
    this.hC.get<CourseModel[]>(HOST + "/get_user_courses/" + localStorage.getItem('user_id'),
                                    {headers: headers}).subscribe({
      next: (res) => {
        this.courses = res;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.hC.get<CollectionModel[]>(HOST + "/get_user_collection/" + localStorage.getItem('user_id'),
                                    {headers: headers}).subscribe({
      next: (response) => {
        this.collections = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () =>{
        // console.log(this.collections)
        // set selection with updated data.
        if (this.selectedColl != EmptyColl && refresh) {
          this.collections.forEach((c) => {
            if (c.id === this.selectedColl.id) {
              this.selectedColl = c;
              //this.chapterService.collChapters = this.selectedColl.list_of_exercises;
              //this.chapterService.collChapters.sort((a, b) => {
              //  if (a['order_num'] > b['order_num']) {
              //    return -1
              //  } if (a['order_num'] < b['order_num']) {
              //    return 1
              //  }
              //  return 0
              //});
              // this.selectedColl.list_of_exercises.forEach((chap) => {
              //   if (chap.id === this.chapterService.selectedChapter.id) {
              //     this.chapterService.selectedChapter = chap;
              //     this.chapterService.selectedChapter.exercise_ids.forEach((t) => {
              //       if (t.id === this.tabService.selectedTab.id) {
              //         this.tabService.selectedTab = t;
              //         this.tabService.updateURL(t.img_url, 'img');
              //         this.tabService.updateURL(t.audio_url, 'audio');
              //         console.log(this.chapterService.selectedChapter, this.tabService.selectedTab)
              //         return
              //      }
              //     });
              //   }
              // });
              return
            }
          });
        } else if (this.selectedColl != EmptyColl && !refresh) {
          this.selectedColl = EmptyColl;
        }
      }
    })
  }

  addChapter(newChap: ChapterModel): void {
    this.selectedColl.list_of_exercises.push(newChap);
  }

  // addNewTab(formData: FormData) {
  //   const headers = getAuthHeaders();
  //   this.hC.post<TabModel>(this.chapterService.addTabUrl, formData, {headers: headers}).subscribe({
  //     next: (data) => {
  //       console.log('Chapter', data);
  //       console.log(this.chapterService.selectedChapter);
  //       this.chapterService.selectedChapter.exercise_ids.push(data);
  //       console.log('Vergleich coll', this.selectedColl.list_of_exercises);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => {
  //       this.tabService.tabs = this.chapterService.selectedChapter.exercise_ids;
  //       //this.tabService.setSelectedTab(this.tabService.tabs[this.tabService.tabs.length -1].id)
  //       this.selectedColl.list_of_exercises.forEach((chap) => {
  //       if (chap.id === this.chapterService.selectedChapter.id) {
  //         console.log("updated collService", chap.exercise_ids);

  //       }
  //     });
  //       //console.log('data', this.selectedChapter);
  //     }
  //   });
  // }

  // deleteOneTab(tab_id: string, chapter_id: string) {
  //   const headers = getAuthHeaders();
  //   const params = new HttpParams().append('chapter_id', chapter_id);
  //   if (this.selectedTab.id === tab_id) {
  //     this.hC.delete<TabModel[]>(HOST + '/delete_tab/' + this.selectedTab.id, {params: params, headers: headers}).subscribe({
  //       next: (res) => {
  //         console.log(res);
  //         this.tabService.tabs = res;
  //         this.chapterService.selectedChapter.exercise_ids = res;
  //         this.selectedTab = EmptyTab;
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //       complete: () => {

  //       }
  //     });
  //   }
  // }


  //deleteOneChapter(chap_id: string, coll_id: string) {
  //  if (this.selectedChapter.id === chap_id) {
  //    const headers = getAuthHeaders();
  //    this.hC.delete<ChapterModel[]>(HOST + "/delete_one_chapter/" + this.selectedChapter.id + '?coll_id=' + coll_id,
  //                                    {headers: headers}).subscribe({
  //      next: (response) => {
  //        console.log(response);
  //        this.collChapters = response;
  //        this.collChapters.sort((a, b) => {
  //          if (a['order_num'] > b['order_num']) {
  //            return 1
  //          }
  //          if (a['order_num'] < b['order_num']) {
  //            return -1
  //          }
  //          return 0
  //        })
  //      },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => {
  //       console.log('Collection deleted')

  //     }
  //   });
  // } else {
  //   alert('Bitte öffnen Sie die Collection erneut.');
  // }
  //}

  setTabMediaData() {
    this.currentImgURL.next(this.selectedTab.img_url);
    this.currentAudioURL.next(this.selectedTab.audio_url);
    this.selectedUploadURLAudio = HOST + '/upload/media/audio/' + this.selectedTab.id + '?user_code=' + this.selectedColl.user_code;
    this.selectedUploadURLImg = HOST + '/upload/media/img/' + this.selectedTab.id + '?user_code=' + this.selectedColl.user_code;
  }

  updateTabMedia(media: string) {
    if (media === 'audio') {
      this.currentAudioURL.next(this.selectedTab.audio_url);
    }
    if (media === 'img') {
      this.currentImgURL.next(this.selectedTab.img_url);
    }
  }
  sortOrder(obj: 'chapters' | 'tabs') {
    if (obj === 'chapters') {
      this.selectedColl.list_of_exercises.sort((a, b) => 
        this.sortPredicate(a, b)
      );
    }
    if (obj === 'tabs') {
      this.selectedChapter.exercise_ids.sort((a, b) => 
        this.sortPredicate(a , b)
      );
    }
  }

  private sortPredicate(a: any, b: any) {
    if (a['order_num'] < b['order_num']) {
      return -1
    }
    if (a['order_num'] > b['order_num']) {
      return 1
    }
    return 0
  }
}
