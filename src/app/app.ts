import {Component, signal, ViewChild, AfterViewInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './components/navbar/navbar';
import { StarfieldDirective } from './directives/star-field/starfield.directive';
import {Footer} from "./components/footer/footer";
import {Modal} from "./components/modal/modal";
import {ModalService} from "./services/modal.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, StarfieldDirective, Footer, Modal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('AngularWebsite');
  @ViewChild('myModal', { static: false }) myModal!: Modal;
  constructor(private modalService: ModalService) {}

  ngAfterViewInit() {
    this.modalService.init(this.myModal)
  }

}
