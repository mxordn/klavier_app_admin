import { Component } from '@angular/core';
import { TabModel } from '../../../models/tab'
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-chapter-details',
  templateUrl: './chapter-details.component.html',
  styleUrls: ['./chapter-details.component.scss']
})
export class ChapterDetailsComponent {
    formTab: any
    list_of_tabs: TabModel[] = [];
    selectedTab: TabModel | undefined;

    constructor(private fB: FormBuilder) {
      this.formTab = this.fB.group({
        test: new FormControl('')        
      })
    }
}
