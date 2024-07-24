import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ButtonComponent } from '@app/shared/components/UI';
import { KEY_DIRECTION_MAPPING } from '@app/shared/constants';
import { DirectionKey } from '@app/shared/types';

@Component({
  selector: 'app-control-button',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './control-button.component.html',
})
export class ControlButtonComponent {
  @Input() disabled: boolean = false;
  @Input({ required: true }) directionLabel!: DirectionKey;
  @Output() moveEvent = new EventEmitter<DirectionKey>();
  appButtonActive: boolean = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const directionKey = KEY_DIRECTION_MAPPING[event.code];
    if (!directionKey) return;
    if (directionKey !== this.directionLabel) return;

    this.appButtonActive = true;
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    const directionKey = KEY_DIRECTION_MAPPING[event.code];
    if (!directionKey) return;
    if (directionKey !== this.directionLabel) return;

    this.appButtonActive = false;

    this.emitMoveEvent(directionKey);
  }

  emitMoveEvent(directionKey: DirectionKey) {
    this.moveEvent.emit(directionKey);
  }
}
