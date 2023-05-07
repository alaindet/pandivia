import { Routes } from '@angular/router';

import { DemoRoute } from './types';
import { DemoPageComponent } from './demo.component';
import { IndexDemoPageComponent } from './pages/_index/index.component';

// Pages
import { BottomNavigationDemoPageComponent } from './pages/bottom-navigation/bottom-navigation.component';
import { ButtonDemoPageComponent } from './pages/button/button.component';
import { CheckboxDemoPageComponent } from './pages/checkbox/checkbox.component';
import { ColorSwatchesDemoPageComponent } from './pages/color-swatches/color-swatches.component';
import { MenuDemoPageComponent } from './pages/actions-menu/actions-menu.component';
import { ModalDemoPageComponent } from './pages/modal/modal.component';
import { QuantityInputDemoPageComponent } from './pages/quantity-input/quantity-input.component';
// ...

export const DEMO_PAGES: DemoRoute[] = [
  demoRoute('bottom-navigation', 'Bottom Navigation', BottomNavigationDemoPageComponent),
  demoRoute('button', 'Button', ButtonDemoPageComponent),
  demoRoute('checkbox', 'Checkbox', CheckboxDemoPageComponent),
  demoRoute('color-swatches', 'Color Swatches', ColorSwatchesDemoPageComponent),
  demoRoute('menu', 'Menu', MenuDemoPageComponent),
  demoRoute('modal', 'Modal', ModalDemoPageComponent),
  demoRoute('quantity-input', 'Quantity Input', QuantityInputDemoPageComponent),
  // ...
];

export const DEMO_ROUTES: Routes = [
  {
    path: '',
    component: DemoPageComponent,
    children: [
      {
        path: '',
        component: IndexDemoPageComponent,
      },
      ...DEMO_PAGES.map(p => ({
        path: p.path,
        component: p.component,
      })),
    ],
  },
];

function demoRoute(path: string, label: string, component: any): DemoRoute {
  return { path, label, component };
}
