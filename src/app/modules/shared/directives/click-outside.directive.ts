import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Input() exceptions: string[] = [];
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    const targetElement = event.target as HTMLElement;

    const isException = this.exceptions.some(exception => {
      return targetElement.closest(exception) !== null;
    });

    if (!clickedInside && !isException) {
      this.clickOutside.emit();
    }
  }
}
