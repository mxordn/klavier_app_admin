import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { AuthService } from 'src/app/auth/auth.service';
import { CollectionService } from 'src/app/collection.service';
import { HOST } from 'src/app/config';
import { CourseService } from 'src/app/course.service';
import { CourseModel, EmptyCourse } from 'src/app/models/course';
import { CourseEditComponent } from '../course-edit/course-edit.component';

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss'],
})
export class CourseOverviewComponent {
  activated: Boolean = false;

  activeIndex: number = 0;
  player: HTMLAudioElement = new Audio();
  player_icon: "pi pi-play" | "pi pi-pause" = "pi pi-play";
  imgURL: string = '';
  audioURL: string = '';
  dialogRef: DynamicDialogRef | undefined;
  description: String = '';

  constructor(public collService: CollectionService,
              public courseService: CourseService,
              private messageService: MessageService,
              private authService: AuthService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private hC: HttpClient) {
    this.collService.course_activated.subscribe({
      next: (val) => {
        this.activated = val;
      }
    });
  }

  openEditCourse() {
    this.dialogRef = this.dialogService.open(CourseEditComponent, {
      header: 'Kurs bearbeiten',
      modal: true,
      style: { width: '500px', height: '530px' },
      draggable: false,
      resizable: false,
    });
  }

  copyClipboard() {
    navigator.clipboard.writeText(this.collService.selectedCourse.user_code.toString());
    this.messageService.add({severity: 'success', summary: 'Code kopiert!', detail: 'Der User Code ist in die Zwischenablage kopiert.'});
  }

  setCourseCollections() {
    const headers = getAuthHeaders()
    let data = new FormData();
    data.append('title', this.collService.selectedCourse.display_name);
    data.append('description', this.collService.selectedCourse.course_description);
    let coll_list: string[] = [];
    console.log('Collections:', this.courseService.courseCollections);
    this.courseService.courseCollections.forEach((coll) => {
      coll_list.push(coll.id);
    });
    if (coll_list.length > 0) {
      data.append('coll_list', coll_list.toString());
    }
    else {
      data.append('coll_list', "empty");
    }

    this.hC.post(HOST + '/upload/update_course_collections/' + this.collService.selectedCourse.id, data, {headers: headers}).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.messageService.add({severity: 'info', summary: "Änderungen gespeichert",
                                  detail: "Neue Reihenfolge wurde gespeichert."});
      }
    });
  }

  deleteCourse(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Willst Du den Kurs wirklich löschen?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ok',
      rejectLabel: 'Abbrechen',
      accept: () => {this.deleteCourseActions()},
      reject: () => {console.log()}
    });
  }

  private deleteCourseActions() {
    const headers: HttpHeaders = getAuthHeaders();
    if (this.authService.is_token_valid()) {
      const params = new HttpParams().set("user_id", this.collService.selectedColl.owner.toString());
      this.hC.delete<CourseModel[]>(HOST + '/delete_one_course/' + this.collService.selectedCourse.id,
                                   {params: params, headers: headers}).subscribe({
        next: (res) => {
          console.log(res);
          this.collService.selectedCourse = EmptyCourse;
          this.collService.getUserCollections(false);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { this.closeOverview(); }
      });
    }
    else { alert("Token abgelaufen. Bitte loggen Sie sich neu ein.") }
  }

  closeOverview() {
    this.collService.course_activated.next(false);
  }
}



