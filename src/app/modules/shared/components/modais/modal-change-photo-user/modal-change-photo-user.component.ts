import { Component, ViewChild, ElementRef } from '@angular/core';
import { Snackbar } from '../../../models/snackbar.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-change-photo-user',
  templateUrl: './modal-change-photo-user.component.html',
  styleUrls: ['./modal-change-photo-user.component.scss']
})
export class ModalChangePhotoUserComponent {
  change: boolean = false;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();

  @ViewChild('zoomImage') zoomImage: ElementRef | undefined;
  scale: number = 1;

  constructor(private modal: NgbActiveModal) {}

  changePhoto() {
    this.change = true;
  }

  back() {
    this.change = false;
  }

  close() {
    this.modal.close();
  }

  confirm() {
    this.modal.close();
  }

  // zoomIn() {
  //   this.scale += 0.1;
  //   this.applyZoom();
  // }

  // zoomOut() {
  //   if (this.scale > 1) {
  //     this.scale -= 0.1;
  //     this.applyZoom();
  //   }
  // }
  // updateZoom(event: any) {
  //   this.scale = event.target.value / 100;
  //   this.applyZoom();
  // }
  // applyZoom() {
  //   if (this.zoomImage) {
  //     this.zoomImage.nativeElement.style.transform = `scale(${this.scale})`;
  //   }
  // }
}
