# To Do

- [ ] Link packages in development via `tsconfig.json` (maybe `tsconfig.dev.json`) to avoid building libs
- [ ] Create the `labels` input like `ModalHostComponent` with their own type, to deal with i18n labels
- [ ] Group `mat*` SVG constant strings into an `ICONS` component constant
- [ ] Refactor
  - [ ] Change demo app to use CSS Grid
  - [ ] Analyze ESBuild
  - [ ] Remove `toObservable` wherever possible
  - [ ] Most controllers should be classes
- [ ] Declare global injectable config for simple i18n a11y labels
  - [ ] Search for "Label = input('" to replace
- [ ] Remove `@jsverse/transloco` from `app-notifications-host`
