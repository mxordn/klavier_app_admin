import { Component, Input } from '@angular/core';
import { CollectionService } from 'src/app/collection.service';
import { ChapterModel } from 'src/app/models/chapter';

@Component({
  selector: 'app-chapter-overview',
  templateUrl: './chapter-overview.component.html',
  styleUrls: ['./chapter-overview.component.scss']
})
export class ChapterOverviewComponent {
  
  @Input('activated') activated: Boolean = false;
  
  constructor(public collService: CollectionService) {}

  openChapter(chapter_id: String) {
    console.log(chapter_id);
  }

}
