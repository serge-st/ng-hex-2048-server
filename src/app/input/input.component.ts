import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input({ required: true }) label: string | undefined;
  @Input({ required: true }) value: number | undefined | null;
  @Input() minValue: number = 0;
  @Output() valueChange = new EventEmitter<string>();

  onInputChange(value: string) {
    this.valueChange.emit(value);
  }
}
