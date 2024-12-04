import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Snackbar } from '../../models/snackbar.model';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  @Input() snackbar: Snackbar = new Snackbar();
  @Output() hide = new EventEmitter<boolean>();
  private timeoutId: any;

  constructor(private translateService: TranslateService) {
    translateService.use('pt-br');
  }

  ngOnInit(): void {
    this.toHide();
  }

  @HostListener('mouseenter') onMouseEnter() {
    clearTimeout(this.timeoutId);
    this.hide.emit(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.toHide();
  }

  toHide() {
    this.timeoutId = setTimeout(() => {
      this.hide.emit(false)
    }, this.snackbar.timeHide)
  }

}
