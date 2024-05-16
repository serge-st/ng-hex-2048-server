import { Component, Input } from '@angular/core';
import { HexagonComponent } from '../hexagon/hexagon.component';
import { HexCoord } from '../hexagon/hex-coord';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HexagonComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  @Input({ required: true }) radius!: number;

  hexLength(hex: HexCoord): number {
    return (Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2;
  }

  hexAdd(a: HexCoord, b: HexCoord): HexCoord {
    return {
      q: a.q + b.q,
      r: a.r + b.r,
      s: a.s + b.s,
    }
  }

  hexSubtract(a: HexCoord, b: HexCoord): HexCoord {
    return {
      q: a.q - b.q,
      r: a.r - b.r,
      s: a.s - b.s
    }
  }

  hexDistance(a: HexCoord, b: HexCoord): number {
    return this.hexLength(this.hexSubtract(a, b));
  }
}
