import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { CollectionService } from 'src/app/collection.service';
import { CollectionModel, HOST } from 'src/app/models/collection';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent {
  editCollectionForm: FormGroup

  constructor(private collService: CollectionService,
            private fb: FormBuilder,
            private hC: HttpClient,
            private dialogRef: DynamicDialogRef) {
    this.editCollectionForm = this.fb.group({
      title: new FormControl(this.collService.selectedColl.display_name, Validators.required),
      collection_description: new FormControl(this.collService.selectedColl.collection_description)
    })
  }

  updateCollectionInfo() {
    if (this.editCollectionForm.valid) {
      const formData = new FormData()
      formData.append("title", this.editCollectionForm.value.title);
      formData.append("collection_description", this.editCollectionForm.value.collection_description)
      const headers = getAuthHeaders();
      this.hC.post<CollectionModel>(HOST + '/upload/updatecollection/' + this.collService.selectedColl.id, formData , {headers: headers}).subscribe({
        next: (res) => {
          this.collService.collections.forEach((c) => {
            if (c.id === res.id) {
              c.display_name = res.display_name;
              c.collection_description = res.collection_description;
              console.log("Response:", res, 'collection', c, this.collService.collections);
              this.collService.selectedColl = c;
            }
            //console.log(c);
          });
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          //console.log("Check:", this.collService.collections);
          //console.log("Check:", this.collService.selectedColl);
          this.dialogRef.close();
        }
      })
    }
  }
}
