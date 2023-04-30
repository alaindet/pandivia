import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-layout',
  standalone: true,
  template: `
    <header>
      <ng-content select="[slot='header']"></ng-content>
    </header>
    <div class="content">
      <main>
        <ng-content></ng-content>
        <ng-content slot="main"></ng-content>
      </main>
      <aside>
        <ng-content select="[slot='aside']"></ng-content>
      </aside>
    </div>
  `,
  styles: [`
    @import 'scoped';

    $app-demo-content-height: $app-demo-header-height + $app-demo-header-margin;
    $app-demo-border: #aaa;

    :host {
      position: absolute;
      display: flex;
      flex-direction: column;
      inset: 0;
    }

    header {
      border-bottom: 2px solid $app-demo-border;
      padding: 1rem 0;
      height: $app-demo-header-height;
      margin: $app-demo-header-margin;
      margin-top: 0;
    }

    .content {
      display: flex;
      height: calc(100vh - #{$app-demo-content-height});
    }

    aside {
      order: 1;
      overflow-y: auto;
      border-right: 2px solid $app-demo-border;
      margin-bottom: 1rem;
      padding: 1rem;
      width: fit-content;
    }

    main {
      order: 2;
      width: 100%;
      overflow-y: auto;
      padding: 1rem;
    }
  `],
})
export class DemoLayoutComponent {
  // ...
}
