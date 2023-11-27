import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { options } from 'marked';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/auth/auth.service';
import { ChapterService } from 'src/app/chapter.service';

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
      formData.append("chap_id", this.chapterService.selectedChapter.id);

      this.chapterService.addNewTab(formData);
      this.dialogRef.close();
    } else {
      alert("Form nicht valide");
    }
  }

}
