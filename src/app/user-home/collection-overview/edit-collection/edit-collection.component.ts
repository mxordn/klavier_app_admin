import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { AuthService } from 'src/app/auth/auth.service';
import { CollectionService } from 'src/app/collection.service';
import { ChapterModel } from 'src/app/models/chapter';
import { CollectionModel, HOST, IdOrderTable } from 'src/app/models/collection';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent {
  editCollectionForm: FormGroup;
  chapters: ChapterModel[];

  constructor(private collService: CollectionService,
            private fb: FormBuilder,
            private hC: HttpClient,
            private authService: AuthService,
            private dialogRef: DynamicDialogRef) {
    this.editCollectionForm = this.fb.group({
      title: new FormControl(this.collService.selectedColl.display_name, Validators.required),
      collection_description: new FormControl(this.collService.selectedColl.collection_description)
    });
    this.chapters = collService.selectedColl.list_of_exercises;
  }

  updateCollectionInfo() {
    if (this.editCollectionForm.valid) {
      const formData = new FormData()
      formData.append("title", this.editCollectionForm.value.title);
      formData.append("collection_description", this.editCollectionForm.value.collection_description)
      const headers = getAuthHeaders();
      if (this.authService.is_token_valid()) {
        this.hC.post<CollectionModel>(HOST + '/upload/update_collection/' + this.collService.selectedColl.id, formData , {headers: headers}).subscribe({
          next: (res) => {
            this.collService.collections.forEach((c) => {
              if (c.id === res.id) {
                c.display_name = res.display_name;
                c.collection_description = res.collection_description;
                console.log("Response:", res, 'collection', c, this.collService.collections);
                this.collService.selectedColl = c;
              }
              //console.log(c);
            });
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            //console.log("Check:", this.collService.collections);
            //console.log("Check:", this.collService.selectedColl);
            this.dialogRef.close();
          }
        });
      } else {
        alert("Bitte loggen Sie sich neu ein. Token abgelaufen.");
      }
    }
  }

  onOrderChanged() {
    let newOrder: Array<IdOrderTable> = new Array()
    let cnt: number = 1;
    this.collService.selectedColl.list_of_exercises.forEach((el) => {
      el.order_num = cnt;
      cnt += 1;
      newOrder.push({id: el.id, order_num: el.order_num});
    });
    console.log("Data to be sent:", newOrder);
    console.log(this.collService.selectedColl.list_of_exercises, {order_list: JSON.stringify(newOrder)});

    const headers: HttpHeaders = getAuthHeaders();
    // let params: HttpParams = new HttpParams()
    // params.append("chapter_id", "chapter");JSON.stringify()

    this.hC.post<IdOrderTable[]>(HOST + '/upload/update_order/' + this.collService.selectedColl.id + '?sort_chapters=true',
              newOrder, {headers: headers}).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log('Error Response', err);
      }
    });
  }
}
