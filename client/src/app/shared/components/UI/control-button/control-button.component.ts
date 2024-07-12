import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { KEY_DIRECTION_MAPPING } from '@app/shared/constants';
import { DirectionKey } from '@app/shared/types';

@Component({
  selector: 'app-control-button',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './control-button.component.html',
  styleUrl: './control-button.component.scss',
})
export class ControlButtonComponent {
  @Input() disabled: boolean = false;
  @Input({ required: true }) directionLabel!: DirectionKey;
  @Output() moveEvent = new EventEmitter<DirectionKey>();

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const directionKey = KEY_DIRECTION_MAPPING[event.code];
    if (!directionKey) return;
    if (directionKey !== this.directionLabel) return;

    this.emitMoveEvent(directionKey);
  }

  emitMoveEvent(directionKey: DirectionKey) {
    this.moveEvent.emit(directionKey);
  }
}
