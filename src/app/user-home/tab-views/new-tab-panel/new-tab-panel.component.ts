import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { AuthService } from 'src/app/auth/auth.service';
import { ChapterService } from 'src/app/chapter.service';
import { CollectionService } from 'src/app/collection.service';
import { TabModel } from 'src/app/models/tab';

@Component({
  selector: 'app-new-tab-panel',
  templateUrl: './new-tab-panel.component.html',
  styleUrls: ['./new-tab-panel.component.scss']
})
export class NewTabPanelComponent {
  newTabForm: FormGroup;

  iconList: string[] = ["music.note",
                        "music.note",
                        "music.quarternote.3",
                        "music.note.list",
                        "music.note.house",
                        "line.3.horizontal",
                        "text.line.first.and.arrowtriangle.forward",
                        "text.line.last.and.arrowtriangle.forward",
                        "arrow.up.and.down.text.horizontal"
                      ];

  constructor(private fB: FormBuilder,
              private hC: HttpClient,
              private collService: CollectionService,
              private chapterService: ChapterService,
              private authService: AuthService,
              private dialogRef: DynamicDialogRef) {
    this.newTabForm = this.fB.group({
      exercise_tab_name: new FormControl("", Validators.required),
      icon: new FormControl(this.iconList, Validators.required),
      exercise_description: new FormControl(" ", Validators.nullValidator)
    });
    this.newTabForm.value.icon = "music.note";
  }

  addTab() {
    if (!this.authService.is_token_valid()) {
      alert("Bitte neu einloggen (Token Timeout)");
      return; 
    }
    if (this.newTabForm.valid) {
      let formData: FormData = new FormData();
      console.log('FG', this.newTabForm);

      formData.append("exercise_tab_name", this.newTabForm.value.exercise_tab_name);
      formData.append("icon", this.newTabForm.value.icon);
      formData.append("exercise_description", this.newTabForm.value.exercise_description);
      formData.append("chap_id", this.collService.selectedChapter.id);
      //addNewTab(formData: FormData)
      if (this.authService.is_token_valid()) {
        const headers = getAuthHeaders();
        this.hC.post<TabModel>(this.chapterService.addTabUrl, formData, {headers: headers}).subscribe({
          next: (data) => {
            console.log('Chapter', data);
            //console.log(this.chapterService.selectedChapter);
            this.collService.selectedChapter.exercise_ids.push(data);
            //console.log('Vergleich coll', this.selectedColl.list_of_exercises);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            //this.collService.selectedChapter.exercise_ids = this.chapterService.selectedChapter.exercise_ids;
            //this.tabService.setSelectedTab(this.tabService.tabs[this.tabService.tabs.length -1].id)
            //this.selectedColl.list_of_exercises.forEach((chap) => {
            //if (chap.id === this.chapterService.selectedChapter.id) {
            //  console.log("updated collService", chap.exercise_ids);
            //}
          //});
            //console.log('data', this.selectedChapter);
            this.dialogRef.close();
          }
        });
      }
      //this.collService.addNewTab(formData);
    } else {
      alert("Form nicht valide");
    }
  }

}
