import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @Output() onFileDropped = new EventEmitter<any>()

  @HostBinding('style.background-color') private background = ''
  @HostBinding('style.opacity') private opacity = '1'
  @HostBinding('style.width') private width = '100%'
  @HostBinding('style.height') private height = '100%'

  constructor() { }

  @HostListener('dragover', ['$event']) onDragOver(evt:any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '';
    this.opacity = '0.6'
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt:any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = ''
    this.opacity = '1'
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt:any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = ''
    this.opacity = '1'
    let files = <FileList>evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }

}
