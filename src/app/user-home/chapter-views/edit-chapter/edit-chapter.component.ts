import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { AuthService } from 'src/app/auth/auth.service';
import { CollectionService } from 'src/app/collection.service';
import { ChapterModel } from 'src/app/models/chapter';
import { HOST, IdOrderTable } from 'src/app/models/collection';
import { TabModel } from 'src/app/models/tab';

@Component({
  selector: 'app-edit-chapter',
  templateUrl: './edit-chapter.component.html',
  styleUrls: ['./edit-chapter.component.scss']
})
export class EditChapterComponent {
  chapUpdateForm: FormGroup;
  tabs: TabModel[];
  
  constructor(private fB: FormBuilder,
              private hC: HttpClient,
              private authService: AuthService,
              private collService: CollectionService,
              private dialogRef: DynamicDialogRef) {
    this.chapUpdateForm = this.fB.group({
      name: new FormControl(this.collService.selectedChapter.name),
      chapter_description: new FormControl(this.collService.selectedChapter.chapter_description)
    });
    this.tabs = this.collService.selectedChapter.exercise_ids;
  }

  updateChapter() {
    const formData: FormData = new FormData();
    formData.append('name', this.chapUpdateForm.value.name);
    formData.append('chapter_description', this.chapUpdateForm.value.chapter_description);
    if (this.authService.is_token_valid()) {
      const headers: HttpHeaders = getAuthHeaders();
      this.hC.post<ChapterModel>(HOST + '/upload/update_chapter/' + this.collService.selectedChapter.id,
                                 formData, {headers: headers}).subscribe({
        next: (res) => {
          this.collService.selectedChapter.name = res.name;
          this.collService.selectedChapter.chapter_description = res.chapter_description;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.dialogRef.close();
        }
      });
    }
  }

  onTabsOrderChanged() {
    let newOrder: Array<IdOrderTable> = new Array()
    let cnt: number = 1;
    this.collService.selectedChapter.exercise_ids.forEach((el) => {
      el.order_num = cnt;
      cnt += 1;
      newOrder.push({id: el.id, order_num: el.order_num});
    });

    console.log("Data to be sent:", newOrder);
    console.log(this.collService.selectedColl.list_of_exercises, {order_list: JSON.stringify(newOrder)});

    if (this.authService.is_token_valid()) {
      const headers: HttpHeaders = getAuthHeaders();
      this.hC.post<IdOrderTable[]>(HOST + '/upload/update_order/' + this.collService.selectedColl.id + '?sort_chapters=false' +
               '&chapter_id=' + this.collService.selectedChapter.id,
                newOrder, {headers: headers}).subscribe({
        next: (res) => {
          console.log(res);
          let crossCheck: boolean = false;
          for (let exercise of this.collService.selectedChapter.exercise_ids) {
            for (let e of res) {
              if (e.id === exercise.id) {
                crossCheck = true;
                break;
              } else {
                crossCheck = false;
              }
            };
          }
          console.log("Server in Sync:", crossCheck);
        },
        error: (err) => {
          console.log('Error Response', err);
        }
      });
    }
  }
}
