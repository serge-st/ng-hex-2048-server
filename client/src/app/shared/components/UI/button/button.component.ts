import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() width?: number;
  // TODO: add button style-type, primary, secondary...

  @HostBinding('style.--width') get with() {
    return this.width + 'px' || undefined;
  }

  @Output() appButtonEvent = new EventEmitter<void>();

  onClickEvent() {
    this.appButtonEvent.emit();
  }
}
