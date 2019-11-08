import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ImagemService {

  constructor(private http: HttpClient) { }

  uploadFile(file): Observable<any> {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: environment.accessKeyId,
        secretAccessKey: environment.secretAccessKey,
        region: 'ohio'
      }
    );
    const params = {
      Bucket: 'magno-tmp',
      Key: 'fotos/' + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    return new Observable(res => {
      bucket.upload(params, function (err, data) {
        if (err) {
          console.log('There was an error uploading your file: ', err);
          res.error(err);
          res.complete();
        } else {
          console.log('Successfully uploaded file.', data);
          res.next(data)
          res.complete();
        }
      });
    })
  }

}
