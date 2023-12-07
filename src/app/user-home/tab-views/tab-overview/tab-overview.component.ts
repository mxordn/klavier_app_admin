import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CollectionService } from 'src/app/collection.service';
import { TabDescriptionComponent } from '../tab-description/tab-description.component';
import { HOST } from 'src/app/models/collection';
import { EmptyTab, TabModel } from 'src/app/models/tab';
import { AuthService } from 'src/app/auth/auth.service';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-tab-overview',
  templateUrl: './tab-overview.component.html',
  styleUrls: ['./tab-overview.component.scss']
})
export class TabOverviewComponent implements OnInit {
  player: HTMLAudioElement = new Audio();
  player_icon: "pi pi-play" | "pi pi-pause" = "pi pi-play";

  activeIndex: number = 0;

  selectedUploadURLImg: string|undefined;
  selectedUploadURLAudio: string|undefined;
  imgURL: string = '';
  audioURL: string = '';
  authHeaders: HttpHeaders;

  constructor(private dialogService: DialogService,
              private hC: HttpClient,
              private authService: AuthService,
              private confirmationDialogService: ConfirmationService,
              public collService: CollectionService) {
    this.authHeaders = getAuthHeaders();
  }

  ngOnInit(): void {
    console.log(this.collService.selectedColl);
    this.collService.currentImgURL.subscribe((val) => {
      this.imgURL = HOST + '/serve_media/' + this.collService.selectedColl.user_code + '/' + val;
      console.log('updated img', this.imgURL);
    });
    this.collService.currentAudioURL.subscribe((val) => {
      this.audioURL = HOST + '/serve_media/' + this.collService.selectedColl.user_code + '/' + val;
      console.log('updated audio', this.audioURL);
    });
  }


  openTab(tab_index: number) {
    let cnt = 0;
    this.collService.selectedChapter.exercise_ids.forEach((t) => {
      if (cnt === tab_index) {
        console.log('setTab', tab_index, t.id);
        this.collService.selectedTab = t;
        this.collService.setTabMediaData();

        //.setSelectedTab(t.id);
        //this.tabService.updateURL(t.audio_url, 'audio');
        //this.tabService.updateURL(t.img_url, 'img');
      }
      cnt += 1;
    });
    
    this.selectedUploadURLAudio = HOST + '/upload/media/audio/' + this.collService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    this.selectedUploadURLImg = HOST + '/upload/media/img/' + this.collService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;
    //this.tabService.selectedUploadURLDescription = HOST + '/upload/description/' + this.tabService.selectedTab.id + '?user_code=' + this.collService.selectedColl.user_code;

    this.player_icon = "pi pi-play";
  }

  openDialogUpdateDescription() {
    console.log(this.collService.selectedTab.exercise_tab_name, this.collService.selectedTab.exercise_description)
    this.dialogService.open(TabDescriptionComponent, {
      header: "Titel und Beschreibung des Tabs",
      style: { width: '600px', height: '530px' },
      draggable: false,
      resizable: false
    });
  }

  clearMedia(media_type: 'img' | 'audio') {
    const headers: HttpHeaders = getAuthHeaders();
    if (this.authService.is_token_valid()) {
      this.hC.delete<TabModel>(HOST+'/del_media/' + this.collService.selectedTab.id + '/' + 
                                media_type + '?user_code=' + this.collService.selectedColl.user_code, 
                                {headers: headers})
      .subscribe({
        next: (res) => {
          console.log(res);
          //this.collService.updateTabData(res);
          if (media_type === 'img') {
            this.collService.selectedTab.img_url = res.img_url;
            this.collService.updateTabMedia(media_type);
          }
          if (media_type === 'audio') {
            this.collService.selectedTab.audio_url = res.audio_url;
            this.collService.updateTabMedia(media_type);
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('successfully deleted.');
        }
      });
    } else {
      alert("Bitte loggen Sie sich neu ein. Token ist abgelaufen.")
    }
  }

  onUpload(e: any, media_type: 'img' | 'audio') {
    console.log('Upload:', e.originalEvent.body);
    const updatedTab: TabModel = e.originalEvent.body;
    this.collService.selectedChapter.exercise_ids.forEach((t) => {
      if (t.id === updatedTab.id) {
        if (media_type === 'audio') {
          t.audio_url = updatedTab.audio_url;
        }
        if (media_type === 'img') {
          t.img_url = updatedTab.img_url;
        }
        this.collService.updateTabMedia(media_type);
        console.log('upload tab set', t);
        //this.tabService.setSelectedTab(t.id);
      }
    });
    //s =  = 
    //this.imgURL = HOST + "/serve_media/" + this.collService.selectedColl.user_code + "/" + this.tabService.selectedTab.img_url;
  }

  delTab(event: Event, tab_id: string) {
    this.confirmationDialogService.confirm({
      target: event.target as EventTarget,
      message: 'Willst Du den Tab wirklich löschen?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ok',
      rejectLabel: 'Abbrechen',
      accept: () => {
        console.log('Tab löschen', tab_id);
        //deleteOneTab(tab_id: string, chapter_id: string) {chapter_
        const headers = getAuthHeaders();
        const params = new HttpParams().append('chapter_id', this.collService.selectedChapter.id);
        if (this.authService.is_token_valid()) {
          this.hC.delete<TabModel[]>(HOST + '/delete_tab/' + tab_id, {params: params, headers: headers}).subscribe({
            next: (res) => {
              console.log('Response:', res);
              //this.tabService.tabs = res;
              this.collService.selectedChapter.exercise_ids = res;
              this.collService.selectedTab = EmptyTab;
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
              console.log('Tab deleted', this.collService.selectedChapter.exercise_ids)
            }
          });
        }
      },
      reject: () => {
        console.log('Tab not deleted', tab_id);
      }
    });
    //this.collService.deleteOneTab(tab_id, this.chapterService.selectedChapter.id.toString());
  }

  playPauseAudio() {
    //console.log(this.tabService.selectedTab.audio_url);
    if (this.player_icon === 'pi pi-play') {
      this.player.src = HOST + '/serve_media/' + this.collService.selectedColl.user_code + '/' + this.collService.selectedTab.audio_url;
      this.player.play()
      this.player.onended = () => {
        this.player_icon = 'pi pi-play';
      };
      this.player_icon = 'pi pi-pause';
    } else {
      this.player.pause();
      this.player_icon = 'pi pi-play';
    }
  }
}
