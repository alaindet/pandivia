import { Routes } from '@angular/router';

import { DemoRoute } from './types';
import { DemoPageComponent } from './demo.component';
import { IndexDemoPageComponent } from './pages/_index/index.component';

// Pages
import { ButtonDemoPageComponent } from './pages/button/button.component';
import { ColorSwatchesDemoPageComponent } from './pages/color-swatches/color-swatches.component';
import { MenuDemoPageComponent } from './pages/actions-menu/actions-menu.component';
import { BottomNavigationDemoPageComponent } from './pages/bottom-navigation/bottom-navigation.component';
import { CheckboxDemoPageComponent } from './pages/checkbox/checkbox.component';
// ...

export const DEMO_PAGES: DemoRoute[] = [
  demoRoute('button', 'Button', ButtonDemoPageComponent),
  demoRoute('checkbox', 'Checkbox', CheckboxDemoPageComponent),
  demoRoute('color-swatches', 'Color Swatches', ColorSwatchesDemoPageComponent),
  demoRoute('menu', 'Menu', MenuDemoPageComponent),
  demoRoute('bottom-navigation', 'Bottom Navigation', BottomNavigationDemoPageComponent),
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
