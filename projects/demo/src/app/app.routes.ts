import { Routes } from '@angular/router';

import { DemoRoute } from './types';
import { IndexDemoPageComponent } from './pages/_index/index.component';

// Pages
import { ActionsMenuDemoPageComponent } from './pages/actions-menu/actions-menu.component';
import { AutocompleteDemoPageComponent } from './pages/autocomplete/autocomplete.component';
import { BottomMenuDemoPageComponent } from './pages/bottom-menu/bottom-menu.component';
import { ButtonDemoPageComponent } from './pages/button/button.component';
import { CardListDemoPageComponent } from './pages/card-list/card-list.component';
import { CheckboxDemoPageComponent } from './pages/checkbox/checkbox.component';
import { ColorSwatchesDemoPageComponent } from './pages/color-swatches/color-swatches.component';
import { FormFieldDemoPageComponent } from './pages/form-field/form-field.component';
import { IconButtonDemoPageComponent } from './pages/icon-button/icon-button.component';
import { LinearSpinnerDemoPageComponent } from './pages/linear-spinner/linear-spinner.component';
import { ModalDemoPageComponent } from './pages/modal/modal.component';
import { NotificationDemoPageComponent } from './pages/notification/notification.component';
import { PageHeaderDemoPageComponent } from './pages/page-header/page-header.component';
import { QuickNumberDemoPageComponent } from './pages/quick-number/quick-number.component';
import { SelectDemoPageComponent } from './pages/select/select.component';
import { TextareaDemoPageComponent } from './pages/textarea/textarea.component';
import { TextInputDemoPageComponent } from './pages/text-input/text-input.component';
import { ToggleDemoPageComponent } from './pages/toggle/toggle.component';
// ...

export const DEMO_PAGES: DemoRoute[] = [
  demoRoute('actions-menu', 'Actions Menu', ActionsMenuDemoPageComponent),
  demoRoute('autocomplete', 'Autocomplete', AutocompleteDemoPageComponent),
  demoRoute('bottom-menu', 'Bottom Menu', BottomMenuDemoPageComponent),
  demoRoute('button', 'Button', ButtonDemoPageComponent),
  demoRoute('card-list', 'Card List', CardListDemoPageComponent),
  demoRoute('checkbox', 'Checkbox', CheckboxDemoPageComponent),
  demoRoute('color-swatches', 'Color Swatches', ColorSwatchesDemoPageComponent),
  demoRoute('form-field', 'Form Field', FormFieldDemoPageComponent),
  demoRoute('icon-button', 'Icon Button', IconButtonDemoPageComponent),
  demoRoute('linear-spinner', 'Linear Spinner', LinearSpinnerDemoPageComponent),
  demoRoute('modal', 'Modal', ModalDemoPageComponent),
  demoRoute('notification', 'Notification', NotificationDemoPageComponent),
  demoRoute('page-header', 'Page Header', PageHeaderDemoPageComponent),
  demoRoute('quick-number', 'Quick Number', QuickNumberDemoPageComponent),
  demoRoute('select', 'Select', SelectDemoPageComponent),
  demoRoute('text-input', 'Text Input', TextInputDemoPageComponent),
  demoRoute('textarea', 'Textarea', TextareaDemoPageComponent),
  demoRoute('toggle', 'Toggle', ToggleDemoPageComponent),
  // ...
];

export const routes: Routes = [
  {
    path: '',
    component: IndexDemoPageComponent,
  },
  ...DEMO_PAGES.map((p) => ({
    path: p.path,
    component: p.component,
  })),
];

function demoRoute(path: string, label: string, component: any): DemoRoute {
  return { path, label, component };
}
