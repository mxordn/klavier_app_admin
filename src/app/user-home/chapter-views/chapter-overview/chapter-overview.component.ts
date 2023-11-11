import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { CollectionService } from 'src/app/collection.service';
import { ChapterModel } from 'src/app/models/chapter';
import { HOST } from 'src/app/models/collection';

@Component({
  selector: 'app-chapter-overview',
  templateUrl: './chapter-overview.component.html',
  styleUrls: ['./chapter-overview.component.scss']
})
export class ChapterOverviewComponent implements OnInit {
  @Input('activated') activated: Boolean = false;
  chapForm!: FormGroup;
  dialogVisible: boolean = false;

  constructor(public collService: CollectionService,
              private fB: FormBuilder,
              private authService: AuthService,
              private hC: HttpClient) {
    this.chapForm = this.fB.group({
      name: new FormControl('', Validators.required),
      chapter_description: new FormControl(''),
      //order_num: new FormControl(String(collService.selectedColl.num_of_chapters + 1))
    })
  }

  ngOnInit(): void {
    console.log(this.collService.selectedColl);
  }

  openChapter(chapter_id: String) {
    console.log(chapter_id);
  }

  openDialogNewChapter(): void {
    this.dialogVisible = true;
  }

  closeDialogNewChapter(): void {
    this.dialogVisible = false;
  }

  createNewChapter(): void {
    if (this.chapForm.valid) {
      console.log('VALID', this.chapForm.value.collection_description)

      console.log(this.chapForm)
      let headers = this.authService.getAuthHeaders()
      let formData: FormData = new FormData();
      formData.append("name", this.chapForm.value.name);
      formData.append("chapter_description", this.chapForm.value.chapter_description);
      formData.append("collection_id", this.collService.selectedColl.id.toString());
      formData.append("owner", this.collService.selectedColl.owner.toString());

      this.hC.post<ChapterModel>(HOST+'/new_chapter', formData, { headers: headers }).subscribe({
        next: (data) => {
          console.log('Neues Kapitel: ', data);
          this.collService.getUserCollections();
        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          this.ngOnInit();
          this.dialogVisible = false;
        }
      })
    } else {
      return
    }
  }

  delCollection() {
    this.collService.deleteOneCollection(this.collService.selectedColl.id.toString())
  }

  delChapter() {
    console.log('Chapter löschen')
    //this.collService.deleteOneCollection(this.collService.selectedColl.id.toString())
  }
}
