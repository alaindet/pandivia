# To Do
- [ ] Add prompt to install new version
- [ ] Create `common` package
- [ ] Refactor
  - [ ] Change demo app to use CSS Grid
  - [ ] Remove `DataSource` from `@app/common/sources`
  - [ ] Remove `EventSource` from `@app/common/sources`
  - [ ] Remove `OnceSource` from `@app/common/sources`
  - [ ] Dismiss the ViewModel (vm) approach from all components
  - [ ] Remove `@import 'scoped';` from every component's .scss file if unneeded
  - [ ] Convert all local CSS variables to the pattern `--_local`
  - [ ] Attach CSS variables to host components
  - [ ] Remove all `queueMicrotask()` by using signals
  - [ ] Refactor action-menu
  - [ ] Move `isMobile` signal inside `MediaQueryService`
  - [ ] Rename all assigned `effect()` as `fooEffect`

## Refactoring
Angular 16
build: 18 files, 1.31 Mb

Angular 17
build: 18 files, 1.32 Mb

Angular 17 post refactoring
build: ? files, ?.?? Mb
