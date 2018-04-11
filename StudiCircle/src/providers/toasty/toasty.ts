import {ToastController} from "ionic-angular";

export class ToastyProvider {

  constructor(private toastCtrl: ToastController) {

  }

  toast(toastMessage: string) {
    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: "dismiss"
    });

    toast.present();
  }

}

