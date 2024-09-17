import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CollectionService } from 'src/app/collection.service';
import { HOST } from 'src/app/config';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { CourseModel } from 'src/app/models/course';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent {
  courseForm: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: DynamicDialogRef,
              private hC: HttpClient,
              private collService: CollectionService) {
    this.courseForm = this.formBuilder.group({
      //name: new FormControl('', Validators.required),
      display_name: new FormControl('', Validators.required),
      course_description: new FormControl('')
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      console.log('VALID', this.courseForm.value.collection_description)

      let headers = getAuthHeaders();
      this.loading = true;

      let formData: FormData = new FormData();
      // formData.append("name", this.collForm.value.name);
      formData.append("display_name", this.courseForm.value.display_name);
      if (this.courseForm.value.course_description) {
        formData.append("course_description", this.courseForm.value.course_description);
      }
      else {
        formData.append("course_description", "");
      }

      this.hC.post<CourseModel>(HOST+'/new_course', formData, { headers: headers }).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.collService.getUserCollections();
          this.loading = false;
          this.dialogRef.close();
        }
      })
    } else {
      return
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
