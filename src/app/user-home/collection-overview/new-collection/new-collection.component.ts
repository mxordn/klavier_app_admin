import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { CollectionService } from 'src/app/collection.service';
import { CollectionModel, HOST } from 'src/app/models/collection';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss']
})
export class NewCollectionComponent {
  
  collForm: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: DynamicDialogRef,
              private hC: HttpClient,
              private collService: CollectionService) {
    this.collForm = this.formBuilder.group({
      //name: new FormControl('', Validators.required),
      display_name: new FormControl('', Validators.required),
      collection_description: new FormControl('')
    });
  }

  onSubmit() {
    if (this.collForm.valid) {
      console.log('VALID', this.collForm.value.collection_description)

      let headers = getAuthHeaders();
      this.loading = true;

      let formData: FormData = new FormData();
      formData.append("name", this.collForm.value.name);
      formData.append("display_name", this.collForm.value.display_name);
      formData.append("collection_description", this.collForm.value.collection_description);

      this.hC.post<CollectionModel>(HOST+'/new_collection', formData, { headers: headers }).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.collService.getUserCollections();
          this.loading = false;
          this.dialogRef.close();
        }
      })
    } else {
      return
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
