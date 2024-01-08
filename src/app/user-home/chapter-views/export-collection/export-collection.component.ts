import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getAuthHeaders } from 'src/app/auth/auth.header';
import { CollectionService } from 'src/app/collection.service';
import { HOST } from 'src/app/config';

@Component({
  selector: 'app-export-collection',
  templateUrl: './export-collection.component.html',
  styleUrls: ['./export-collection.component.scss']
})
export class ExportCollectionComponent {
  formGroupExport: FormGroup;

  constructor(private hC: HttpClient,
               private collService: CollectionService,
               private dialogRef: DynamicDialogRef) {
    this.formGroupExport = new FormGroup({
      include_media: new FormControl(true, Validators.required)
    });
  }

  downloadAndExportCollection() {
    const headers = getAuthHeaders()
    console.log(this.formGroupExport.value)
    const include_media: string = this.formGroupExport.value.include_media.toString();
    this.hC.get<Blob>(HOST + '/export/collection/' + this.collService.selectedColl.user_code + '?include_media=' + include_media,
                 {headers: headers, responseType:'blob' as 'json'}).subscribe({
      next: (res: Blob) => {
        console.log(res);
        let filename: string = this.collService.selectedColl.user_code.toString();
        if (this.formGroupExport.value.include_media) {
          filename += '_.zip';
        } else {
          filename += '_.json';
        }
        let binaryData: Array<Blob> = [];
        binaryData.push(res);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      error: (err) => {console.log(err);},
      complete: () => {
        this.dialogRef.close();
      }
    });
  }
}
