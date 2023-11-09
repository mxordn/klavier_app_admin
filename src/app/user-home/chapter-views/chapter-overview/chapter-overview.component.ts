import { Component, Input } from '@angular/core';
import { ChapterModel } from 'src/app/models/chapter';

@Component({
  selector: 'app-chapter-overview',
  templateUrl: './chapter-overview.component.html',
  styleUrls: ['./chapter-overview.component.scss']
})
export class ChapterOverviewComponent {
  
  @Input('list_of_chapters') list_of_chapters: ChapterModel[] = [];
  @Input('activated') activated: Boolean = false;
  @Input('coll_name') coll_name: String = '';

  constructor() {}

  openChapter(chapter_id: String) {
    console.log(chapter_id);
  }

}
