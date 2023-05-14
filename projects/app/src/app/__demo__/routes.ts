import { Routes } from '@angular/router';

import { DemoRoute } from './types';
import { DemoPageComponent } from './demo.component';
import { IndexDemoPageComponent } from './pages/_index/index.component';

// Pages
import { BottomNavigationDemoPageComponent } from './pages/bottom-navigation/bottom-navigation.component';
import { ButtonDemoPageComponent } from './pages/button/button.component';
import { CheckboxDemoPageComponent } from './pages/checkbox/checkbox.component';
import { ColorSwatchesDemoPageComponent } from './pages/color-swatches/color-swatches.component';
import { FormFieldDemoPageComponent } from './pages/form-field/form-field.component';
import { MenuDemoPageComponent } from './pages/actions-menu/actions-menu.component';
import { ModalDemoPageComponent } from './pages/modal/modal.component';
import { QuickNumberDemoPageComponent } from './pages/quick-number/quick-number.component';
import { SelectDemoPageComponent } from './pages/select/select.component';
import { TextInputDemoPageComponent } from './pages/text-input/text-input.component';
// ...

export const DEMO_PAGES: DemoRoute[] = [
  demoRoute('bottom-navigation', 'Bottom Navigation', BottomNavigationDemoPageComponent),
  demoRoute('button', 'Button', ButtonDemoPageComponent),
  demoRoute('checkbox', 'Checkbox', CheckboxDemoPageComponent),
  demoRoute('color-swatches', 'Color Swatches', ColorSwatchesDemoPageComponent),
  demoRoute('form-field', 'Form Field', FormFieldDemoPageComponent),
  demoRoute('menu', 'Menu', MenuDemoPageComponent),
  demoRoute('modal', 'Modal', ModalDemoPageComponent),
  demoRoute('quick-number', 'Quick Number', QuickNumberDemoPageComponent),
  demoRoute('select', 'Select', SelectDemoPageComponent),
  demoRoute('text-input', 'Text Input', TextInputDemoPageComponent),
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
