import { Component, Input, OnInit } from '@angular/core';
import { EmptyTab, TabModel } from '../../../models/tab'
import { FormBuilder, FormControl } from '@angular/forms';
import { UploadEvent } from 'primeng/fileupload';
import { TabService } from 'src/app/tab.service';
import { CollectionService } from 'src/app/collection.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab-details',
  templateUrl: './tab-details.component.html',
  styleUrls: ['./tab-details.component.scss']
})
export class TabDetailsComponent {
    formTab: any;

    constructor(private fB: FormBuilder,
                private collService: CollectionService,
                private hC: HttpClient,
                public tabService: TabService) {
      this.formTab = this.fB.group({
        //img_file: new FormControl(),
        //audio_file: new FormControl(),
        tab_description: new FormControl('')
      });
      //{{ UploadURL }} + '/audio/' + {{ tab.id }} + '?user_code=' {{ user_code }}
      ///+ this.media_type + '/' + this.user_code + '/' + this.tab.id 
    }

    onUpload(e: any, upload: any) {
      console.log('Upload:', e, upload);
    }

    updateDescription() {
      if (this.formTab.valid) {
        this.tabService.updateTabDescription(this.formTab);
      }
    }
}
