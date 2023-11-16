import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadHandlerEvent, UploadEvent } from 'primeng/fileupload';
import { AuthService } from 'src/app/auth.service';
import { ChapterService } from 'src/app/chapter.service';
import { CollectionService } from 'src/app/collection.service';
import { ChapterModel } from 'src/app/models/chapter';
import { HOST } from 'src/app/models/collection';
import { TabModel } from 'src/app/models/tab';
import { TabService } from 'src/app/tab.service';

@Component({
  selector: 'app-chapter-overview',
  templateUrl: './chapter-overview.component.html',
  styleUrls: ['./chapter-overview.component.scss']
})
export class ChapterOverviewComponent implements OnInit {
  @Input('activated') activated: Boolean = false;
  chapForm!: FormGroup;
  newTabForm!: FormGroup;
  dialogVisible: boolean = false;
  editTabDialogVisible: boolean = false;
  newTabPanelVisible = false;
  HOST = HOST;
  activeIndex: number = 0;
  player: HTMLAudioElement = new Audio()
  player_icon: "pi pi-play" | "pi pi-pause" = "pi pi-play"

  constructor(public collService: CollectionService,
              private fB: FormBuilder,
              private authService: AuthService,
              public tabService: TabService,
              private chapterService: ChapterService,
              private hC: HttpClient) {
    this.chapForm = this.fB.group({
      name: new FormControl('', Validators.required),
      chapter_description: new FormControl(''),
      //order_num: new FormControl(String(collService.seletedColl.num_of_chapters + 1))
    });

    this.newTabForm = this.fB.group({    
      icon: new FormControl("music.note", Validators.required),
      exercise_description: new FormControl(''),
    });
  }

  ngOnInit(): void {
    console.log(this.collService.selectedColl);
  }

  openChapter(chapter_id: String) {
    this.collService.selectedColl.list_of_exercises.forEach((c) => {
      if (c.id === chapter_id) {
        this.chapterService.selectedChapter = c;
        console.log(c);
      }
    })
    this.activeIndex = 0;
    this.openTab(0);
    this.player_icon = "pi pi-play";
  }

  openTab(tab_index: number) {
    let cnt = 0;
    this.chapterService.selectedChapter.exercise_ids.forEach((t) => {
      if (cnt === tab_index) {
        this.tabService.selectedTab = t;
      }
      cnt += 1;
    });
    
    this.tabService.selectedUploadURLAudio = HOST + '/upload/media/audio/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.tabService.selectedUploadURLImg = HOST + '/upload/media/img/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.tabService.selectedUploadURLDescription = HOST + '/upload/description/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;

    this.player_icon = "pi pi-play";
  }

  openDialogNewChapter(): void {
    this.dialogVisible = true;
  }

  closeDialogNewChapter(): void {
    this.dialogVisible = false;
  }

  createNewChapter(): void {
    if (this.chapForm.valid) {
      console.log('VALID', this.chapForm.value.collection_description)

      console.log(this.chapForm)
      let headers = this.authService.getAuthHeaders()
      let formData: FormData = new FormData();
      formData.append("name", this.chapForm.value.name);
      formData.append("chapter_description", this.chapForm.value.chapter_description);
      formData.append("collection_id", this.collService.selectedColl.id.toString());
      formData.append("owner", this.collService.selectedColl.owner.toString());

      this.hC.post<ChapterModel>(HOST+'/new_chapter', formData, { headers: headers }).subscribe({
        next: (data) => {
          console.log('Neues Kapitel: ', data);
          this.collService.getUserCollections();
        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          this.ngOnInit();
          this.dialogVisible = false;
        }
      })
    } else {
      return
    }
  }

  openNewTabPanel(chapter_index: number) {
    this.chapterService.selectedChapter = this.collService.selectedColl.list_of_exercises[chapter_index];
    this.chapterService.addTabUrl = HOST + '/new_exercise';
    this.newTabPanelVisible = true;
  }

  editTab(chapter_index: number, tab_index: number) {

    this.tabService.selectedTab = this.collService.selectedColl.list_of_exercises[chapter_index].exercise_ids[tab_index];
    this.tabService.selectedUploadURLAudio = HOST + '/upload/media/audio/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.tabService.selectedUploadURLImg = HOST + '/upload/media/img/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.tabService.selectedUploadURLDescription = HOST + '/upload/description/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;

    this.editTabDialogVisible = true;
    console.log(this.tabService.selectedTab)
  }

  delCollection() {
    this.collService.deleteOneCollection(this.collService.selectedColl.id.toString())
  }

  delChapter() {
    console.log('Chapter löschen')
    //this.collService.deleteOneCollection(this.collService.selectedColl.id.toString())
  }

  playPauseAudio() {
    console.log(this.tabService.selectedTab.audio_url);
    if (this.player_icon === 'pi pi-play') {
      this.player.src = HOST + '/serve_media/' + this.collService.selectedColl.user_code + '/' + this.tabService.selectedTab.audio_url;
      this.player.play();
      this.player_icon = 'pi pi-pause';
    } else {
      this.player.pause();
      this.player_icon = 'pi pi-play';
    }
  }

  onUpload(e: any) {
    console.log('Upload:', e);
    this.tabService.selectedTab = e.originalEvent.body;
    this.collService.getUserCollections(true);
  }

  clearImg() {
    this.hC.delete<TabModel>(HOST+'/del_img/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }
}
