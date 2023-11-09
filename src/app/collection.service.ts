import { Injectable } from '@angular/core';
import { CollectionModel, EmptyColl } from './models/collection';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  collections: CollectionModel[] = [];
  chapters_activated: Boolean = false
  selectedColl: CollectionModel = EmptyColl;
  
  constructor() { }
}
