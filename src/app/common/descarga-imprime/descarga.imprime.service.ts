import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/common/services/base.service';
import { DataService } from "src/app/data.service";
import { ModalService } from 'src/app/common/modal-Services';
import { AuthService } from 'src/app/auth/auth.service';




const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
  })
};




@Injectable({
  providedIn: 'root',
})
export class DescargaImprimeService extends BaseService {

  isLoggedIn = false;
  @BlockUI() blockUI: NgBlockUI;
  // store the URL so we can redirect after logging in
  redirectUrl: string;



  constructor(
    protected http: HttpClient, protected data: DataService, protected modalService: ModalService

  ) {
    super(http, data, modalService);
  }



  generateFile(url: string, fileName: string) {
    return this.http.get(url, { responseType: 'blob' as 'json' })
      .pipe(catchError(error => this.handlerPersonalizedError(error, "danger", "Error al descargar el documento")));
  }

  downloadFile(url: string, filename: string = null): void {

    this.generateFile(url, filename).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        if (filename)
          downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    )
  }


  generateFileNotificacion(url: string) {
    return this.http.get(url, {observe: 'response', responseType: 'blob' as 'json' })
      .pipe(catchError(error => this.handlerPersonalizedError(error, "danger", "Error al descargar el documento")));
  }

  downloadFileNotificacion(url: string): void {
    this.generateFileNotificacion(url).subscribe(
      (response: any) => {
         console.log(response);
         let dataType = response.body.type;
         let name = response.headers.get("Content-Disposition");
         let filename = name.split("=")[1];;
         let binaryData = [];
         binaryData.push(response.body);
         let downloadLink = document.createElement('a');
         downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        
           downloadLink.setAttribute('download', filename);
           document.body.appendChild(downloadLink);
           downloadLink.click();
      }
    )
  }
}


