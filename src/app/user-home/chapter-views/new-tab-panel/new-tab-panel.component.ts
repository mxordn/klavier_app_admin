import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChapterService } from 'src/app/chapter.service';

@Component({
  selector: 'app-new-tab-panel',
  templateUrl: './new-tab-panel.component.html',
  styleUrls: ['./new-tab-panel.component.scss']
})
export class NewTabPanelComponent {
  @Input('newTabPanelVisible') newTabPanelVisible: boolean = false;
  newTabForm: FormGroup;

  constructor(private fB: FormBuilder,
              private chapterService: ChapterService) {
    this.newTabForm = this.fB.group({
      exercise_tab_name: new FormControl("", Validators.required),
      icon: new FormControl("music.note", Validators.required),
      exercise_description: new FormControl("")
    })
  }

  addTab() {
    if (this.newTabForm.valid) {
      this.chapterService.addNewTab(this.newTabForm, this.chapterService.selectedChapter.id.toString());
      this.newTabPanelVisible = false;
    } else {
      alert("Form nicht valide");
    }
  }

}
