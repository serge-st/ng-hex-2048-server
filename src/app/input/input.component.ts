import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

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

  ngOnChanges(changes: SimpleChanges) {
    console.log(`Value changed for ${this.label}:`, changes['value'].currentValue);
  }
}
