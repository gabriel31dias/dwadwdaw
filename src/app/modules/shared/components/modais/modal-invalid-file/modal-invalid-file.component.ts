import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-invalid-file',
  templateUrl: './modal-invalid-file.component.html',
  styleUrls: ['./modal-invalid-file.component.scss']
})
export class ModalInvalidFileComponent {

  files: string[] = [];
  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    setTimeout(() => {
      this.closeButton.nativeElement.focus();
    }, 0);
  }

  close() {
    this.modal.close();
  }

}
