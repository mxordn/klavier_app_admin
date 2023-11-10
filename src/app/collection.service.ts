import { Injectable } from '@angular/core';
import { CollectionModel, EmptyColl, HOST } from './models/collection';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  collections: CollectionModel[] = [];
  chapters_activated: Boolean = false
  selectedColl: CollectionModel = EmptyColl;
  
  constructor(private hC: HttpClient
    ) { }

  public getUserCollections() {
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
  }

}
