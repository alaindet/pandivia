https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-actions-active-descendant/

- TODO
  - [x] Create VM with single subscription with data for template
  - [x] Focus management
  - [x] Add click out feature
  - [ ] Styling
  - [ ] Test everything




- $INIT
  - Save all first letters of actions
  - All menu items have tabindex = -1

- $EVENTS
  - Open menu: focus items, then focus first item, set aria-expanded=true on button
  - Close menu: Remove --focused from any item, focus button, remove aria-expanded on button, remove aria-activedescendant from items menu
  - Focus on any item: --focused on item, aria-activedescendant=$ITEMID on items menu

- Container
  - Focusin: Capture any inner focus in and add --focused to container
  - Focusout: Capture any inner focus out and remove --focused to container

- Button
  - Click: toggle menu, stop event
  - Space/Enter/Down: open menu, set focus to first item, stop event
  - Escape: close menu, stop event
  - Up: open menu, focus last, stop event
  - Any other key: nothing

- Items menu
  - Stop anything if pressing Ctrl, Alt or Meta
  - ?If pressing shift and a letter: Search and focus by that letter uppercased
  - Space/Enter: close menu, confirm item, stop event
  - Escape: close menu, stop event
  - Up: Focus previous/last, stop event
  - Down: Focus next/first, stop event
  - Home/Page Up: Focus first, stop event
  - End/Page Down: Focus last, stop event
  - Tab: close menu, DON'T stop event
  - Any letter: search and focus by that letter (upper or lower case)

- Item
  - Click: Close menu, confirm item
  - Mouseover: Focus hovered item

- Window:
  - Mousedown: close menu if open
