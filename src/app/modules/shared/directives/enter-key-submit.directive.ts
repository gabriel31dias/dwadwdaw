import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appEnterKeySubmit]'
})
export class EnterKeySubmitDirective {

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const self = this.el.nativeElement;
      const parent = self.closest('.tab-enter');
      if (parent) {
        const focusable = parent.querySelectorAll('input, select, button, textarea');
        const index = Array.prototype.indexOf.call(focusable, self);
        const next = focusable[index + 1] as HTMLElement;
        if (next) {
          next.focus();
        }
      }
      event.preventDefault();
    }
  }
}
