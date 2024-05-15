import { Component, Input, OnChanges } from '@angular/core';
import { StyleVariables } from './style-variables';

@Component({
  selector: 'app-hexagon',
  standalone: true,
  imports: [],
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.scss',
})
export class HexagonComponent implements OnChanges {
  @Input({ required: true }) width!: number;

  height!: number;

  border: number = 18;

  styleVariables!: StyleVariables;

  private addPixel(value: number): string {
    return value + 'px';
  }

  ngOnChanges() {
    this.height = (Math.sqrt(3) * (this.width / 2));

    this.styleVariables = {
      width: this.addPixel(this.width),
      height: this.addPixel(this.height),
      borderWidth: this.addPixel(this.border),
    };
  }
}
