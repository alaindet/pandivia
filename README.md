# Pandivia

Pandivia is a shopping list progressive web app (PWA) made with Angular 17+ and Firebase.

Users have
- a List page where they can add items to buy, grouped by category
- an Inventory page where they can add frequently bought items for easy retrieval
- a Profile page to be able to change theme, language and invite new users to use the application

The Angular application features
- Angular workspaces (TODO)
- Completely custom and accessible components
- Themable via CSS variables
- Internationalization via `@jsverse/transloco`
- Service workers
- NgRx

## How to run it locally

Requirements
  - Node.js 20+
  - Java 17+

1. `npm install`
2. `npm run firebase:dev`
3. Open another terminal and run `npm run start`

## Screenshots

### On mobile

![Mobile screenshot - List page](https://raw.githubusercontent.com/alaindet/pandivia/main/projects/app/src/assets/screenshots/narrow-1.png)

![Mobile screenshot - List modal](https://raw.githubusercontent.com/alaindet/pandivia/main/projects/app/src/assets/screenshots/narrow-2.png)

![Mobile screenshot - Inventory page](https://raw.githubusercontent.com/alaindet/pandivia/main/projects/app/src/assets/screenshots/narrow-3.png)

![Mobile screenshot - Fairy theme](https://raw.githubusercontent.com/alaindet/pandivia/main/projects/app/src/assets/screenshots/narrow-4.png)

### On desktop

![Desktop screenshot - List page](https://raw.githubusercontent.com/alaindet/pandivia/main/projects/app/src/assets/screenshots/wide-1.png)

![Desktop screenshot - List modal](https://raw.githubusercontent.com/alaindet/pandivia/main/projects/app/src/assets/screenshots/wide-2.png)

![Desktop screenshot - Inventory page](https://raw.githubusercontent.com/alaindet/pandivia/main/projects/app/src/assets/screenshots/wide-3.png)

![Desktop screenshot - Fairy theme](https://raw.githubusercontent.com/alaindet/pandivia/main/projects/app/src/assets/screenshots/wide-4.png)

## Resources and ideas

- https://www.w3.org/WAI/ARIA/apg/patterns/
- https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow
- https://www.atlassian.com/git/tutorials/git-log
- https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow
- https://dev.to/ngrx/announcing-ngrx-v16-integration-with-angular-signals-functional-effects-standalone-schematics-and-more-5gk6
- https://www.npmjs.com/package/@angular/localize
- https://whiteduck.de/how-to-approach-angular-internationalization-i18n-in-2022/
- https://www.npmjs.com/package/@angular/fire
- https://www.npmjs.com/package/@angular/pwa
- https://colorgen.dev/
- https://medium.com/city-pantry/handling-errors-in-ngrx-effects-a95d918490d9
