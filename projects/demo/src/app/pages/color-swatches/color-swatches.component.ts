import { Component } from '@angular/core';

type Swatch = {
  name: string;
  backgroundColor: string;
  textColor: string;
};

type SwatchesCollection = {
  name: string;
  swatches: Swatch[];
};

@Component({
  selector: 'app-demo-color-swatches',
  templateUrl: './color-swatches.component.html',
  styleUrl: './color-swatches.component.css',
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
        swatches: UTIL_COLORS.map((color) => ({
          name: color,
          backgroundColor: `var(--app-color-${color})`,
          textColor: color === 'black' ? 'white' : 'black',
        })),
      },
      ...COLORS.map((color) => ({
        name: color,
        swatches: WEIGHTS.map((weight) => ({
          name: weight.toString(),
          backgroundColor: `var(--app-color-${color}-${weight})`,
          textColor: weight > 600 ? 'white' : 'black',
        })),
      })),
    ];
  }
}
