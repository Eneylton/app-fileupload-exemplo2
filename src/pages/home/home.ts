import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AngularFireStorage} from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public uploadPercent:Observable<number>;
  public downloadUrl:Observable<string>;
   

  constructor(public navCtrl: NavController,
    private file: File,
    private afStorage: AngularFireStorage,
    private camera: Camera) {}

  async openGaleria(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation:true
    };
    try{

      const fileUri: string= await this.camera.getPicture(options);

      let file: string;

      file = fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.indexOf('?'));

      const path:string = fileUri.substring(0,fileUri.lastIndexOf('/'));

      console.log(path);

      const buffer:ArrayBuffer = await this.file.readAsArrayBuffer(path,file);

      const blob = new Blob([buffer],{type:"image/jpeg"});
      
      console.log(blob);

      this.uploadImagem(blob);

    }catch(error){
     console.log(error);
    }
  }

  uploadImagem(blob: Blob){
   const ref = this.afStorage.ref('imagem.jpg');
   const task = ref.put(blob);

   this.uploadPercent = task.percentageChanges();
  
   task.snapshotChanges().pipe(
     finalize(()=> this.downloadUrl = ref.getDownloadURL()
     )).subscribe();
  
  }

}
