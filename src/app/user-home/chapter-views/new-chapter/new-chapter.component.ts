import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { AuthService } from 'src/app/auth/auth.service';
import { CollectionService } from 'src/app/collection.service';
import { ChapterModel } from 'src/app/models/chapter';
import { HOST } from 'src/app/config';

@Component({
  selector: 'app-new-chapter',
  templateUrl: './new-chapter.component.html',
  styleUrls: ['./new-chapter.component.scss']
})
export class NewChapterComponent {
  chapForm!: FormGroup;

  constructor(private dialogRef: DynamicDialogRef,
              private fB: FormBuilder,
              private collService: CollectionService,
              private authService: AuthService,
              private hC: HttpClient) {
    this.chapForm = this.fB.group({
      name: new FormControl('', Validators.required),
      chapter_description: new FormControl(''),
    })
  }

  createNewChapter(): void {
    if (!this.authService.is_token_valid()) {
      alert("Bitte neu einloggen (Timeout)");
      return;
    }
    if (this.chapForm.valid) {
      console.log('VALID', this.chapForm.value.collection_description)

      console.log(this.chapForm)
      let headers = getAuthHeaders()
      let formData: FormData = new FormData();
      formData.append("name", this.chapForm.value.name);
      formData.append("chapter_description", this.chapForm.value.chapter_description);
      formData.append("collection_id", this.collService.selectedColl.id.toString());
      formData.append("owner", this.collService.selectedColl.owner.toString());

      this.hC.post<ChapterModel>(HOST+'/new_chapter', formData, { headers: headers }).subscribe({
        next: (data) => {
          console.log('Neues Kapitel: ', data);
          //this.collService.getUserCollections();
          this.collService.collections.forEach((c) => {
            if (c.id === this.collService.selectedColl.id) {
              c.list_of_exercises.push(data);
              console.log(this.collService.selectedColl.list_of_exercises);
            }
          });
        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          this.dialogRef.close()
        }
      })
    } else {
      return
    }
  }
}
