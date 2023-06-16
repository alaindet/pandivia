import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

const imports = [
  CommonModule,
];

type Swatch = {
  name: string;
  cssClass: string;
};

type SwatchesCollection = {
  name: string;
  swatches: Swatch[];
};

@Component({
  selector: 'app-demo-color-swatches',
  standalone: true,
  imports,
  templateUrl: './color-swatches.component.html',
  styleUrls: ['./color-swatches.component.scss'],
})
export class ColorSwatchesDemoPageComponent {

  swatchesCollections: SwatchesCollection[] = [];

  ngOnInit() {
    const COLORS = ['grey', 'primary', 'secondary', 'tertiary'];
    const WEIGHTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const UTIL_COLORS = ['white', 'black', 'error', 'success'];

    this.swatchesCollections = [
      {
        name: 'utils',
        swatches: UTIL_COLORS.map(color => ({
          name: color,
          cssClass: `-${color}`,
        })),
      },
      ...COLORS.map(color => ({
        name: color,
        swatches: WEIGHTS.map(weight => ({
          name: weight.toString(),
          cssClass: `-${color}-${weight}`,
        })),
      })),
    ];
  }
}
