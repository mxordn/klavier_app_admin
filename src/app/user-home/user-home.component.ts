import { Component, OnInit } from '@angular/core';
import { CollectionModel, HOST } from '../models/collection';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ChapterOverviewComponent } from './chapter-views/chapter-overview/chapter-overview.component';


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  collections: CollectionModel[] = [];
  chapters_activated: Boolean = false
  selectedColl: CollectionModel = {
    name: '',
    display_name: '',
    collection_description: '',
    list_of_exercises: [],
    owner: '',
    num_of_chapters: 0,
    user_code: '',
    id: ''
  };
  formGroup!: FormGroup;
  
  constructor(private hC: HttpClient, public authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    let headers = new HttpHeaders()
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token') || '');
    console.log('LOG Header', headers.get('Authorization'))
    this.hC.get<CollectionModel[]>(HOST + "/get_user_collection/" + localStorage.getItem('user_id'),
                                    {headers: headers}).subscribe({
      next: (response) => {
        this.collections = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () =>{
        console.log(this.collections)

      }
    })
    //this.formGroup = new FormGroup({
    //  selectedCollection: new FormControl<CollectionModel | null>(null)
    //});
  }

  openCollection(id: String) {
    console.log('Öffnen', id)
    this.collections.forEach((coll) => {
      if (coll.id === id) {
        this.selectedColl = coll;
        return
      }
    })

  }
  openCreateCollection() {
    this.router.navigate(["create_collection"])
  }
}
