import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { ChapterService } from 'src/app/chapter.service';
import { CollectionService } from 'src/app/collection.service';
import { ChapterModel } from 'src/app/models/chapter';
import { HOST } from 'src/app/models/collection';
import { TabModel } from 'src/app/models/tab';
import { TabService } from 'src/app/tab.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabDescriptionComponent } from '../tab-description/tab-description.component';
import { NewTabPanelComponent } from '../new-tab-panel/new-tab-panel.component';
import { NewChapterComponent } from '../new-chapter/new-chapter.component';
import { EditCollectionComponent } from '../../collection-overview/edit-collection/edit-collection.component';
import { AuthService } from 'src/app/auth/auth.service';

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
  newTabPanelVisible = false;
  HOST = HOST;
  activeIndex: number = 0;
  player: HTMLAudioElement = new Audio()
  player_icon: "pi pi-play" | "pi pi-pause" = "pi pi-play"
  imgURL: string = ''
  audioURL: string = ''
  dialogRef: DynamicDialogRef | undefined;

  constructor(public collService: CollectionService,
              private fB: FormBuilder,
              public tabService: TabService,
              public chapterService: ChapterService,
              private dialogService: DialogService,
              private authService: AuthService,
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
    this.tabService.imgURL.subscribe((val) => {
      this.imgURL = HOST + '/serve_media/' + this.collService.selectedColl.user_code + '/' + val;
      console.log('updated img', this.imgURL);
    });
    this.tabService.audioURL.subscribe((val) => {
      this.audioURL = HOST + '/serve_media/' + this.collService.selectedColl.user_code + '/' + val;
      console.log('updated audio', this.audioURL);
    });
  }

  openChapter(chapter_id: String) {
    this.collService.selectedColl.list_of_exercises.forEach((c) => {
      if (c.id === chapter_id) {
        this.chapterService.selectedChapter = c;
        console.log(c);
        this.tabService.tabs = c.exercise_ids.sort((a, b) => {
          if (a['order_num'] < b['order_num']) {
            return -1
          } if (a['order_num'] > b['order_num']) {
            return 1
          }
          return 0
        });
        if (this.tabService.tabs.length != 0) {
          this.tabService.setSelectedTab(this.tabService.tabs[0].id);
        }
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
        console.log('setTab', tab_index, t.id);
        this.tabService.setSelectedTab(t.id);
        //this.tabService.updateURL(t.audio_url, 'audio');
        //this.tabService.updateURL(t.img_url, 'img');
      }
      cnt += 1;
    });
    
    this.tabService.selectedUploadURLAudio = HOST + '/upload/media/audio/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.tabService.selectedUploadURLImg = HOST + '/upload/media/img/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.tabService.selectedUploadURLDescription = HOST + '/upload/description/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;

    this.player_icon = "pi pi-play";
  }

  openDialogNewChapter(): void {
    this.dialogService.open(NewChapterComponent, {
      header: "Neues Kapitel hinzufügen",
      modal: true,
      style: { width: '400px' },
      draggable: false,
      resizable: false,
    });
    //this.dialogVisible = true;
  }

  openDialogUpdateDescription(tabId: string) {
    //this.dialogDescriptionVisible = true;
    this.dialogRef = this.dialogService.open(TabDescriptionComponent, {
      data: {
        title: this.tabService.selectedTab.exercise_tab_name,
        tab_desc: this.tabService.selectedTab.exercise_description
      },
      header: "Titel und Beschreibung des Tabs"
    });
    this.dialogRef.onClose.subscribe(() => {
      this.chapterService.selectedChapter.exercise_ids.forEach((t) => {
        if (t.id === tabId) {
          this.tabService.setSelectedTab(t.id);
        }
      })
    });
  }

//  closeDialogNewChapter(): void {
//    this.dialogVisible = false;
//  }

  openNewTabPanel(chapter_index: number) {
    this.dialogRef = this.dialogService.open(NewTabPanelComponent, {
      header: "Neuen Tab anlegen",
      modal: true,
      style: { width: '400px' },
      draggable: false,
      resizable: false
    });
  //    this.chapterService.selectedChapter = this.chapterService.collChapters[chapter_index];
  }

  editCollection() {
    if (this.authService.is_token_valid()) {
      this.dialogService.open(EditCollectionComponent, {
        header: "Sammlung bearbeiten",
        modal: true,
        style: { width: '400px', height: '350px' },
        draggable: false,
        resizable: false,
      });
    } else {
      alert("Bitte loggen Sie sich neu ein (Timeout).");
    }
  }

  editTab(chapter_index: number, tab_index: number) {
    this.tabService.selectedTab = this.collService.selectedColl.list_of_exercises[chapter_index].exercise_ids[tab_index];
    this.tabService.selectedUploadURLAudio = HOST + '/upload/media/audio/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.tabService.selectedUploadURLImg = HOST + '/upload/media/img/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.tabService.selectedUploadURLDescription = HOST + '/upload/description/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;

  }

  delCollection() {
    this.collService.deleteOneCollection(this.collService.selectedColl.id.toString())
    this.activated = false;
  }

  delChapter() {
    console.log('Chapter löschen')
    this.chapterService.deleteOneChapter(this.chapterService.selectedChapter.id.toString(),
                                        this.collService.selectedColl.id.toString());
  }

  delTab(tab_id: string) {
    console.log('Tab löschen', tab_id);
    this.collService.deleteOneTab(tab_id, this.chapterService.selectedChapter.id.toString());
  }

  playPauseAudio() {
    //console.log(this.tabService.selectedTab.audio_url);
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
    console.log('Upload:', e.originalEvent.body);
    const updatedTab: TabModel = e.originalEvent.body;
    this.chapterService.selectedChapter.exercise_ids.forEach((t) => {
      if (t.id === updatedTab.id) {
        t = updatedTab;
        console.log('upload tab set', t);
        this.tabService.setSelectedTab(t.id);
      }
    });
    //s =  = 
    //this.imgURL = HOST + "/serve_media/" + this.collService.selectedColl.user_code + "/" + this.tabService.selectedTab.img_url;
  }

  clearMedia(media_type: 'img' | 'audio') {
    const headers: HttpHeaders = getAuthHeaders();
    if (this.authService.is_token_valid()) {
      this.hC.delete<TabModel>(HOST+'/del_media/' + this.tabService.selectedTab.id + '/' + 
                                media_type + '?user_code=' + this.collService.selectedColl.user_code, 
                                {headers: headers})
      .subscribe({
        next: (res) => {
          console.log(res);
          this.tabService.updateTabData(res);
          //this.tabService.setSelectedTab(res.id);
          //this.collService.getUserCollections(); = 
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('successfully deleted.');
        }
      });
    }
  }

  copyClipboard() {
    navigator.clipboard.writeText(this.collService.selectedColl.user_code.toString())
  }
}
