import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { CollectionService } from 'src/app/collection.service';
import { HOST } from 'src/app/config';
import { CourseModel } from 'src/app/models/course';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent {
  courseEditForm: FormGroup;
  loading: boolean = false;

  constructor(private fB: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private hC: HttpClient,
    private collService: CollectionService
  ) {
    this.courseEditForm = this.fB.group({
      display_name: new FormControl(this.collService.selectedCourse.display_name, Validators.required),
      course_description: new FormControl(this.collService.selectedCourse.course_description, Validators.nullValidator)
    });
  }

  onSubmitEditCourse() {
    this.loading = true;
    let headers = getAuthHeaders();

    let data: FormData = new FormData();
    data.append('title', this.courseEditForm.value.display_name);
    data.append('description', this.courseEditForm.value.course_description);
    this.hC.post<CourseModel>(HOST + '/upload/update_course/' + this.collService.selectedCourse.id, data, {headers: headers}).subscribe({
      next: (res) => {
        this.collService.courses.forEach((c) => {
          if (c.id === res.id) {
            c = res;
            this.collService.selectedCourse = c;
          }
        });
      },
      error: (err) => {console.log(err)},
      complete: () => {
        this.loading = false;
        this.closeDialog();
      }
    });
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
