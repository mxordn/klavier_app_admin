import { Component, OnInit } from '@angular/core';
import { HOST } from '../models/collection';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { getAuthHeaders } from '../auth/auth.header';
import { Router } from '@angular/router';
import { CollectionService } from '../collection.service';
import { ChapterService } from '../chapter.service';


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  //collections: CollectionModel[] = [];
  chapters_activated: Boolean = false
  //selectedColl: CollectionModel = {
  //  name: '',
  //  display_name: '',
  //  collection_description: '',
  //  list_of_exercises: [],
  //  owner: '',
  //  num_of_chapters: 0,
  //  user_code: '',
  //  id: ''
  //};
  formGroup: FormGroup;
  dialogVisible: boolean = false;

  collForm: FormGroup
  loading: boolean
  
  constructor(private hC: HttpClient,
               public authService: AuthService,
               private router: Router,
               public collService: CollectionService,
               private chapterService: ChapterService,
               private formBuilder: FormBuilder) {
    this.loading = false;
    this.formGroup = this.formBuilder.group({})
    this.collForm = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        display_name: new FormControl('', Validators.required),
        collection_description: new FormControl('')
    });
    //this.collService.getUserCollections();
  }
  
  ngOnInit(): void {
    console.log('component initialized')
  }

  ngOnDestroy(): void {
    console.log('component destroyed')
  }

  openDialog() {
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  openCollection(id: String) {
    console.log('Öffnen', id)
    this.chapters_activated = true;
    this.collService.collections.forEach((coll) => {
      if (coll.id === id) {
        this.collService.selectedColl = coll;
        this.chapterService.collChapters = coll.list_of_exercises;
        return
      }
    })

  }

  openCreateCollection() {
    this.router.navigate(["create_collection"])
  }

  onSubmit() {
    if (this.collForm.valid) {
      console.log('VALID', this.collForm.value.collection_description)

      console.log(this.collForm)
      let headers = getAuthHeaders()
      this.loading = true;
      let formData: FormData = new FormData();
      formData.append("name", this.collForm.value.name);
      formData.append("display_name", this.collForm.value.display_name);
      formData.append("collection_description", this.collForm.value.collection_description);
      this.hC.post(HOST+'/new_collection', formData, { headers: headers }).subscribe({
        next: (data) => {
          console.log(data)
        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          this.collService.getUserCollections();
          this.loading = false;
          this.dialogVisible = false;
        }
      })
    } else {
      return
    }
  }
}
