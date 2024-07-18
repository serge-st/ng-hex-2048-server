import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberInputComponent {
  @Input({ required: true }) label: string | undefined;
  @Input({ required: true }) value: number | undefined | null;
  @Input() step: number = 1;
  @Input() minValue: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  onInputChange(value: string): void {
    this.valueChange.emit(Number(value));
  }
}
