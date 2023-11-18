import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabService } from 'src/app/tab.service';

@Component({
  selector: 'app-tab-description',
  templateUrl: './tab-description.component.html',
  styleUrls: ['./tab-description.component.scss']
})
export class TabDescriptionComponent {
    formTab: any;
    title: string = this.tabService.selectedTab.exercise_tab_name;
    tab_desc: string = this.tabService.selectedTab.exercise_description;

    constructor(private fB: FormBuilder,
                public tabService: TabService,
                public ref: DynamicDialogRef) {
      this.formTab = this.fB.group({
        exercise_tab_name: new FormControl(this.title),
        tab_description: new FormControl(this.tab_desc)
      });
      //{{ UploadURL }} + '/audio/' + {{ tab.id }} + '?user_code=' {{ user_code }}
      ///+ this.media_type + '/' + this.user_code + '/' + this.tab.id 
    }

    updateDescription() {
      if (this.formTab.valid) {
        this.tabService.updateTabDescription(this.formTab);
      }
      this.ref.close();
    }
}
