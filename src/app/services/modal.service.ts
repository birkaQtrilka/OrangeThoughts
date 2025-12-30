import {Injectable} from "@angular/core";
import {Modal} from "../components/modal/modal";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalManager!: Modal;

  init(modal: Modal){
    this.modalManager = modal;
  }

  open(imagePath: string, caption: string = "") {
    this.modalManager.open(imagePath, caption);
  }

}
