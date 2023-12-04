import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { ChapterService } from 'src/app/chapter.service';
import { CollectionService } from 'src/app/collection.service';
import { ChapterModel } from 'src/app/models/chapter';
import { CollectionModel, EmptyColl, HOST } from 'src/app/models/collection';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabService } from 'src/app/tab.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabDescriptionComponent } from '../../tab-views/tab-description/tab-description.component';
import { NewTabPanelComponent } from '../../tab-views/new-tab-panel/new-tab-panel.component';
import { NewChapterComponent } from '../new-chapter/new-chapter.component';
import { EditCollectionComponent } from '../../collection-overview/edit-collection/edit-collection.component';
import { AuthService } from 'src/app/auth/auth.service';
import { EditChapterComponent } from '../edit-chapter/edit-chapter.component';

@Component({
  selector: 'app-chapter-overview',
  templateUrl: './chapter-overview.component.html',
  styleUrls: ['./chapter-overview.component.scss'],
  providers: [ConfirmationService]
})
export class ChapterOverviewComponent {
  @Input('activated') activated: Boolean = false;
  //chapForm!: FormGroup;
  //newTabForm!: FormGroup;
  //dialogVisible: boolean = false;
  //newTabPanelVisible = false;
  //HOST = HOST;
  activeIndex: number = 0;
  player: HTMLAudioElement = new Audio()
  player_icon: "pi pi-play" | "pi pi-pause" = "pi pi-play"
  imgURL: string = ''
  audioURL: string = ''
  dialogRef: DynamicDialogRef | undefined;

  constructor(public collService: CollectionService,
              public tabService: TabService,
              public chapterService: ChapterService,
              private dialogService: DialogService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private authService: AuthService,
              private hC: HttpClient) {
    //this.chapForm = this.fB.group({
    //  name: new FormControl('', Validators.required),
    //  chapter_description: new FormControl(''),
      //order_num: new FormControl(String(collService.seletedColl.num_of_chapters + 1))
    //});

    //this.newTabForm = this.fB.group({    
    //  icon: new FormControl("music.note", Validators.required),
    //  exercise_description: new FormControl(''),
    //});
    this.collService.chapters_activated.subscribe({
      next: (val) => {
        this.activated = val;
      }
    });
  }

  openChapter(chapter_id: String) {
    this.collService.selectedColl.list_of_exercises.forEach((c) => {
      if (c.id === chapter_id) {
        this.collService.selectedChapter = c;
        this.collService.sortOrder('tabs');
        //console.log(c);
        // c.exercise_ids.sort((a, b) => {
        //   if (a['order_num'] < b['order_num']) {
        //     return -1
        //   } if (a['order_num'] > b['order_num']) {
        //     return 1
        //   }
        //   return 0
        // });
        if (this.collService.selectedChapter.exercise_ids.length != 0) {
          this.collService.selectedTab = this.collService.selectedChapter.exercise_ids[0];
          this.collService.setTabMediaData();
        }
      }
    })
    this.activeIndex = 0;
    //this.openTab(0);
    this.collService.selectedTab = this.collService.selectedChapter.exercise_ids[0];
    this.player_icon = "pi pi-play";
  }

  //openTab(tab_index: number) {
  //  let cnt = 0;
  //  this.chapterService.selectedChapter.exercise_ids.forEach((t) => {
  //    if (cnt === tab_index) {
  //      console.log('setTab', tab_index, t.id);
  //      this.collService.selectedTab = t;
  //      this.collService.setTabMediaData();
  //      //.setSelectedTab(t.id);
  //      //this.tabService.updateURL(t.audio_url, 'audio');
  //      //this.tabService.updateURL(t.img_url, 'img');
  //    }
  //    cnt += 1;
  //  });
    
  //  this.tabService.selectedUploadURLAudio = HOST + '/upload/media/audio/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
  //  this.tabService.selectedUploadURLImg = HOST + '/upload/media/img/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
  //  this.tabService.selectedUploadURLDescription = HOST + '/upload/description/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;

  //  this.player_icon = "pi pi-play";
  //}

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
    // this.dialogRef.onClose.subscribe(() => {
    //   this.chapterService.selectedChapter.exercise_ids.forEach((t) => {
    //     if (t.id === tabId) {
    //       this.tabService.setSelectedTab(t.id);
    //     }
    //   })
    // });
  }

//  closeDialogNewChapter(): void {
//    this.dialogVisible = false;
//  }

  openNewTabPanel() {
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
        style: { width: '800px', height: '500px' },
        draggable: false,
        resizable: false,
      });
    } else {
      alert("Bitte loggen Sie sich neu ein (Timeout).");
    }
  }

  editChapter() {
    this.dialogService.open(EditChapterComponent, {
      header: 'Kapitel bearbeiten',
      modal: true,
      style: { width: '800px', height: '500px' },
      draggable: false,
      resizable: false,
    });
  }
  //editTab(chapter_index: number, tab_index: number) {
  //  this.tabService.selectedTab = this.collService.selectedColl.list_of_exercises[chapter_index].exercise_ids[tab_index];
  //  this.tabService.selectedUploadURLAudio = HOST + '/upload/media/audio/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
  //  this.tabService.selectedUploadURLImg = HOST + '/upload/media/img/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
  //  this.tabService.selectedUploadURLDescription = HOST + '/upload/description/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;

  //}

  delCollection(event: Event) {
    //this.collService.deleteOneCollection(this.collService.selectedColl.id.toString())
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Soll die Sammlung wirklich gelöscht werden?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const headers = getAuthHeaders();
        const params = new HttpParams().set("user_id", this.collService.selectedColl.owner.toString());
        if (this.authService.is_token_valid()) {
          this.hC.delete<CollectionModel[]>(HOST + "/delete_one_collection/" + this.collService.selectedColl.id,
                                          {params: params, headers: headers}).subscribe({
            next: (response) => {
              console.log(response);
              this.collService.selectedColl = EmptyColl;
              this.collService.getUserCollections(false);
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
              console.log('Collection deleted')
            }
          });
        } else {
          alert('Bitte öffnen Sie die Collection erneut.');
        }
        this.activated = false;
      },
      reject: () => {
        console.log("Sammlung wirklich löschen wurde abgelehnt.");
      }
    });
  }

  delChapter(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Willst Du das Kapitel wirklich löschen?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ok',
      rejectLabel: 'Abbrechen',
      accept: () => {
        const headers = getAuthHeaders();
        if (this.authService.is_token_valid()) {
          this.hC.delete<ChapterModel[]>(HOST + "/delete_one_chapter/" + this.collService.selectedChapter.id +
                                         '?coll_id=' + this.collService.selectedColl.id,
                                          {headers: headers}).subscribe({
            next: (response) => {
              console.log(response);
              this.collService.selectedColl.list_of_exercises = response;
              this.collService.selectedColl.list_of_exercises.sort((a, b) => {
                if (a['order_num'] > b['order_num']) {
                  return 1
                }
                if (a['order_num'] < b['order_num']) {
                  return -1
                }
                return 0
              })
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
              console.log('Collection deleted', this.collService.selectedColl, this.collService.collections)
            }
          });
        } else {
          alert('Bitte öffnen Sie die Collection erneut.');
        }
      },
      reject: () => {
        console.log('Chapter löschen');
      }     
    });
    //this.chapterService.deleteOneChapter(this.chapterService.selectedChapter.id.toString(),
    //                                    this.collService.selectedColl.id.toString());
  }

  copyClipboard() {
    navigator.clipboard.writeText(this.collService.selectedColl.user_code.toString());
    this.messageService.add({severity: 'success', summary: 'Code kopiert!', detail: 'Der User Code ist in die Zwischenablage kopiert.'});
  }
}
