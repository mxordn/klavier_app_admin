import { Component } from '@angular/core';
import { EmptyColl } from '../models/collection';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { CollectionService } from '../collection.service';
import { DialogService } from 'primeng/dynamicdialog';
import { NewCollectionComponent } from './collection-overview/new-collection/new-collection.component';
import { NewCourseComponent } from './course-views/new-course/new-course.component';
import { EmptyCourse } from '../models/course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent {
  //collections: CollectionModel[] = [];implements OnInit 
  chapters_activated: boolean = false;
  course_activated: boolean = false;
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

  collForm: FormGroup;
  loading: boolean;
  
  constructor(private hC: HttpClient,
               public authService: AuthService,
               public collService: CollectionService,
               public courseService: CourseService,
               private dialogService: DialogService,
               private formBuilder: FormBuilder) {
    this.loading = false;
    this.formGroup = this.formBuilder.group({})
    this.collForm = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        display_name: new FormControl('', Validators.required),
        collection_description: new FormControl('')
    });
    this.collService.chapters_activated.subscribe({
      next: (val) => {
        this.chapters_activated = val;
      }
    });
    this.collService.course_activated.subscribe({
      next: (val) => {
        this.course_activated = val;
      }
    });
    //this.collService.getUserCollections();
  }
  
  // ngOnInit(): void {
  //   console.log('component initialized')
  // }

  // ngOnDestroy(): void {
  //   console.log('component destroyed')
  // }

  openNewCollectionDialog() {
    this.dialogService.open(NewCollectionComponent, {
      header: 'Neue Sammlung anlegen'
    });
  }

  openNewCourseDialog() {
    this.dialogService.open(NewCourseComponent, {
      header: 'Neuen Kurs anlegen'
    });
  }

  //closeDialog() {
  //  this.dialogVisible = false;Visible = true
  //}

  openCollection(id: String) {
    //console.log('Öffnen', id, e.value.id)
    this.chapters_activated = true;
    this.collService.collections.forEach((coll) => {
      if (coll.id === id) {
        this.collService.selectedColl = coll;
        this.collService.sortOrder('chapters');
        //this.chapterService.collChapters = coll.list_of_exercises;
        this.collService.chapters_activated.next(true);
        this.collService.course_activated.next(false);
        return
      }
    });
    if (this.collService.selectedColl === EmptyColl) {
      alert('Sammlung nicht gefunden.');
    }
  }
  
  openCourse(id: String) {
    console.log(id);
    this.course_activated = true;
    this.collService.courses.forEach((course) => {
      if (course.id === id) {
        console.log("found", course.display_name)
        this.collService.selectedCourse = course;
        this.courseService.courseCollections = course.list_of_collections;
        this.courseService.updateAvailableCollections();
        this.collService.course_activated.next(true);
        this.collService.chapters_activated.next(false);
        return;
      }
    });
    if (this.collService.selectedCourse === EmptyCourse) {
      alert('Kurs nicht gefunden.');
    }
  }

  openCreateCollection() {
    this.dialogService.open(NewCollectionComponent, {
      header: "Neue Collection anlegen",
      modal: true,
      width: '500px',
      draggable: false,
      resizable: false
    });
  }

  // onSubmit() {
  //   if (this.collForm.valid) {
  //     console.log('VALID', this.collForm.value.collection_description)

  //     console.log(this.collForm)
  //     let headers = getAuthHeaders()
  //     this.loading = true;
  //     let formData: FormData = new FormData();
  //     formData.append("name", this.collForm.value.name);
  //     formData.append("display_name", this.collForm.value.display_name);
  //     formData.append("collection_description", this.collForm.value.collection_description);
  //     this.hC.post(HOST+'/new_collection', formData, { headers: headers }).subscribe({
  //       next: (data) => {
  //         console.log(data)
  //       },
  //       error: (err) => {
  //         console.log(err)
  //       },
  //       complete: () => {
  //         this.collService.getUserCollections();
  //         this.loading = false;
  //         this.dialogVisible = false;
  //       }
  //     })
  //   } else {
  //     return
  //   }
  // }
}
