import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/auth/auth.service';
import { CollectionService } from 'src/app/collection.service';
import { HOST } from 'src/app/models/collection';
import { TabModel } from 'src/app/models/tab';
import { TabService } from 'src/app/tab.service';

@Component({
  selector: 'app-tab-description',
  templateUrl: './tab-description.component.html',
  styleUrls: ['./tab-description.component.scss']
})
export class TabDescriptionComponent {
    formTab: any;
    title: string = ''
    // = this.tabService.selectedTab.exercise_tab_name;
    tab_desc: string = '';
    // = this.tabService.selectedTab.exercise_description;

    constructor(private fB: FormBuilder,
                private hC: HttpClient,
                public collService: CollectionService,
                private authService: AuthService,
                public ref: DynamicDialogRef) {
      this.formTab = this.fB.group({
        exercise_tab_name: new FormControl(this.title),
        tab_description: new FormControl(this.tab_desc)
      });
      //{{ UploadURL }} + '/audio/' + {{ tab.id }} + '?user_code=' {{ user_code }}
      ///+ this.media_type + '/' + this.user_code + '/' + this.tab.id 
    }

    updateDescription() {
      //updateTabDescription(formTab: FormGroup) {
      if (this.authService.is_token_valid()) {
        if (this.formTab.valid) {
          let formData: FormData = new FormData();
          formData.append("tab_description", this.formTab.value.tab_description);
          formData.append("exercise_tab_name", this.formTab.value.exercise_tab_name);
    
          this.hC.post<TabModel>(HOST + '/upload/description/' + this.collService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code, formData).subscribe({
            next: (data) => {
              this.collService.selectedTab = data;
              this.collService.selectedChapter.exercise_ids.forEach((t) => {
                if (t.id === this.collService.selectedTab.id) {
                  t.exercise_description = this.collService.selectedTab.exercise_description;
                  t.exercise_tab_name = this.collService.selectedTab.exercise_tab_name;
                }
              })
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
              console.log('updated data tab:', this.collService.selectedTab);
              this.ref.close();
            }
          });
        }
      }
      //if (this.formTab.valid) {
      //  this.tabService.updateTabDescription(this.formTab);
      //}
    }
}
