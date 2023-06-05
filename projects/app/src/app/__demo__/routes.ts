import { Routes } from '@angular/router';

import { DemoRoute } from './types';
import { DemoPageComponent } from './demo.component';
import { IndexDemoPageComponent } from './pages/_index/index.component';

// Pages
import { BottomMenuDemoPageComponent } from './pages/bottom-menu/bottom-menu.component';
import { ButtonDemoPageComponent } from './pages/button/button.component';
import { CardListDemoPageComponent } from './pages/card-list/card-list.component';
import { CheckboxDemoPageComponent } from './pages/checkbox/checkbox.component';
import { ColorSwatchesDemoPageComponent } from './pages/color-swatches/color-swatches.component';
import { FormFieldDemoPageComponent } from './pages/form-field/form-field.component';
import { LinearSpinnerDemoPageComponent } from './pages/linear-spinner/linear-spinner.component';
import { MenuDemoPageComponent } from './pages/actions-menu/actions-menu.component';
import { ModalDemoPageComponent } from './pages/modal/modal.component';
import { NotificationDemoPageComponent } from './pages/notification/notification.component';
import { PageHeaderDemoPageComponent } from './pages/page-header/page-header.component';
import { QuickNumberDemoPageComponent } from './pages/quick-number/quick-number.component';
import { SelectDemoPageComponent } from './pages/select/select.component';
import { TextInputDemoPageComponent } from './pages/text-input/text-input.component';
import { AutocompleteDemoPageComponent } from './pages/autocomplete/autocomplete.component';
// ...

export const DEMO_PAGES: DemoRoute[] = [
  demoRoute('autocomplete', 'Autocomplete', AutocompleteDemoPageComponent),
  demoRoute('bottom-menu', 'Bottom Menu', BottomMenuDemoPageComponent),
  demoRoute('button', 'Button', ButtonDemoPageComponent),
  demoRoute('card-list', 'Card List', CardListDemoPageComponent),
  demoRoute('checkbox', 'Checkbox', CheckboxDemoPageComponent),
  demoRoute('color-swatches', 'Color Swatches', ColorSwatchesDemoPageComponent),
  demoRoute('form-field', 'Form Field', FormFieldDemoPageComponent),
  demoRoute('linear-spinner', 'Linear Spinner', LinearSpinnerDemoPageComponent),
  demoRoute('menu', 'Menu', MenuDemoPageComponent),
  demoRoute('modal', 'Modal', ModalDemoPageComponent),
  demoRoute('notification', 'Notification', NotificationDemoPageComponent),
  demoRoute('page-header', 'Page Header', PageHeaderDemoPageComponent),
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
