import { Injectable } from '@angular/core';
import { CollectionService } from './collection.service';
import { CollectionModel } from './models/collection';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courseCollections: CollectionModel[];
  availableCollections: CollectionModel[] = [];

  constructor(public collService: CollectionService) {
    this.courseCollections = collService.selectedCourse.list_of_collections;
  }

  public updateAvailableCollections() {
    this.availableCollections = [];
    this.collService.collections.forEach((c) => {
      let add_c: Boolean = true;
      filler: for (let c_in of this.courseCollections) {
        console.log(c.id, c_in.id);
        if (c.id === c_in.id) {
          add_c = false;
          break filler;
        }
      };
      if (add_c) {
        this.availableCollections.push(c);
      }
    });
    console.log('available', this.availableCollections);
    this.sortCollections();
  }

  private sortCollections() {
    if (this.collService.selectedCourse.coll_order != "empty") {
      let order_list: string[] = this.collService.selectedCourse.coll_order.split(",");
      this.courseCollections.sort((a, b) => order_list.indexOf(a.id) - order_list.indexOf(b.id))
      console.log(this.availableCollections);
    }
    // courseCollections
  }
}
