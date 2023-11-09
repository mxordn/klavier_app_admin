import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HOST } from '../models/collection'
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.scss']
})
export class CollectionFormComponent {

  collForm: FormGroup
  loading: boolean

  constructor(private formBuilder: FormBuilder,
              private hc: HttpClient,
              private authService: AuthService) {
    this.loading = false;
    this.collForm = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        display_name: new FormControl('', Validators.required),
        collection_description: new FormControl('')
    });
  }

  onSubmit() {
    console.log(this.collForm)
    let headers = this.authService.getAuthHeaders()
    this.loading = true;
    let formData: FormData = new FormData();
    formData.append("name", this.collForm.value.name);
    formData.append("display_name", this.collForm.value.display_name);
    formData.append("collection_description", this.collForm.value.collection_description);
    this.hc.post(HOST+'/new_collection', formData, { headers: headers }).subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        this.loading = false;

      }
    })
  }

}
