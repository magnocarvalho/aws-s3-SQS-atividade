import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";
import * as SQS from "aws-sdk/clients/sqs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root"
})
export class ImagemService {
  sqs: SQS.ClientConfiguration = {
    apiVersion: "2012-11-05",
    region: "us-east-2",
    accessKeyId: environment.accessKeyId,
    secretAccessKey: environment.secretAccessKey,
    credentials: {
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey
    }
  };
  public mensagems: any = [];
  constructor() {
    AWS.config.update({
      region: "ohio",
      credentials: {
        accessKeyId: environment.accessKeyId,
        secretAccessKey: environment.secretAccessKey
      }
    });
    this.listaMensagem();
  }

  uploadFile(file): Observable<any> {
    const contentType = file.type;
    const bucket = new S3({
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
      region: "ohio"
    });
    const params = {
      Bucket: "magno-tmp",
      Key: "fotos/" + file.name,
      Body: file,
      ACL: "public-read",
      ContentType: contentType
    };
    return new Observable((res) => {
      bucket.upload(params, function(err, data) {
        if (err) {
          console.log("There was an error uploading your file: ", err);
          res.error(err);
          res.complete();
        } else {
          console.log("Successfully uploaded file.", data);
          var sqs = new SQS(this.sqs);
          var params = {
            DelaySeconds: 100,
            MessageBody: data.Location,
            QueueUrl:
              "https://sqs.us-east-2.amazonaws.com/791245121628/magno-test"
          };
          sqs.sendMessage(params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              this.mensagems = data;
              console.log("Success", data);
            }
          });
          res.next(data);
          res.complete();
        }
      });
    });
  }
  listaMensagem() {
    var queueURL =
      "https://sqs.us-east-2.amazonaws.com/791245121628/magno-test";

    var params = {
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: queueURL,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };
    var sqs = new SQS(this.sqs);
    sqs.receiveMessage(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        this.mensagems = data.Messages;
        console.log("Success", data);
      }
    });
  }
}
