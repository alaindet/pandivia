'use strict';

export const SELECTOR = Object.freeze({
  BUTTON: 'button',
  MENU: '[role="menu"]',
  MENU_ITEM: '[role="menuitem"]',
});

export const KEY = Object.freeze({
  TAB: 'Tab',
  SPACE: ' ',
  ENTER: 'Enter',
  ARROW_DOWN: 'ArrowDown',
  DOWN: 'Down',
  ESC: 'Esc',
  ESCAPE: 'Escape',
  UP: 'Up',
  ARROW_UP: 'ArrowUp',
  HOME: 'Home',
  PAGE_UP: 'PageUp',
  END: 'End',
  PAGE_DOWN: 'PageDown',
});

export const EVENT = Object.freeze({
  KEYDOWN: 'keydown',
  CLICK: 'click',
  MOUSEOVER: 'mouseover',
  MOUSEDOWN: 'mousedown',
  FOCUS: 'focus',
  FOCUSIN: 'focusin',
  FOCUSOUT: 'focusout',
  LOAD: 'load',
});

export const CSS_CLASS = Object.freeze({
  FOCUSED: '--focused',
});

class MenuButtonActionsActiveDescendant {

  constructor(menuContainerEl, onMenuActionConfirmed) {

    // Select elements
    this.menuContainerEl = menuContainerEl;
    this.menuButtonEl = menuContainerEl.querySelector(SELECTOR.BUTTON);
    this.menuItemsEl = menuContainerEl.querySelector(SELECTOR.MENU);
    this.menuItemEls = [];
    this.currentMenuitemEl = null;
    this.firstMenuitemEl = null;
    this.lastMenuitemEl = null;

    this.onMenuActionConfirmedConfirmed = onMenuActionConfirmed;
    this.firstChars = [];

    // Bind events to menu button
    this.menuButtonEl.addEventListener(EVENT.KEYDOWN, this.onButtonKeydown.bind(this));
    this.menuButtonEl.addEventListener(EVENT.CLICK, this.onButtonClick.bind(this));

    // Bind events to menu
    this.menuItemsEl.addEventListener(EVENT.KEYDOWN, this.onMenuKeydown.bind(this));

    // Bind events to items
    const items = menuContainerEl.querySelectorAll(SELECTOR.MENU_ITEM);

    for (var i = 0; i < items.length; i++) {
      const menuitem = items[i];
      this.menuItemEls.push(menuitem);
      menuitem.tabIndex = -1;
      this.firstChars.push(menuitem.textContent.trim()[0].toLowerCase());

      menuitem.addEventListener(EVENT.CLICK, this.onMenuitemClick.bind(this));
      menuitem.addEventListener(EVENT.MOUSEOVER,this.onMenuitemMouseover.bind(this));

      if (!this.firstMenuitemEl) {
        this.firstMenuitemEl = menuitem;
      }
      this.lastMenuitemEl = menuitem;
    }

    // Bind events to the menu container
    menuContainerEl.addEventListener(EVENT.FOCUSIN, this.onFocusin.bind(this));
    menuContainerEl.addEventListener(EVENT.FOCUSOUT, this.onFocusout.bind(this));

    // Bind events to the window outside the menu container
    window.addEventListener(EVENT.MOUSEDOWN, this.onBackgroundMousedown.bind(this), true);
  }

  setFocusToMenuitem(newMenuitem) {
    for (let i = 0; i < this.menuItemEls.length; i++) {
      const menuitem = this.menuItemEls[i];
      if (menuitem === newMenuitem) {
        this.currentMenuitemEl = newMenuitem;
        menuitem.classList.add(CSS_CLASS.FOCUSED);
        this.menuItemsEl.setAttribute('aria-activedescendant', newMenuitem.id);
      } else {
        menuitem.classList.remove(CSS_CLASS.FOCUSED);
      }
    }
  }

  setFocusToFirstMenuitem() {
    this.setFocusToMenuitem(this.firstMenuitemEl);
  }

  setFocusToLastMenuitem() {
    this.setFocusToMenuitem(this.lastMenuitemEl);
  }

  setFocusToPreviousMenuitem() {
    var newMenuitem, index;

    if (this.currentMenuitemEl === this.firstMenuitemEl) {
      newMenuitem = this.lastMenuitemEl;
    } else {
      index = this.menuItemEls.indexOf(this.currentMenuitemEl);
      newMenuitem = this.menuItemEls[index - 1];
    }

    this.setFocusToMenuitem(newMenuitem);

    return newMenuitem;
  }

  setFocusToNextMenuItem() {
    var newMenuitem, index;

    if (this.currentMenuitemEl === this.lastMenuitemEl) {
      newMenuitem = this.firstMenuitemEl;
    } else {
      index = this.menuItemEls.indexOf(this.currentMenuitemEl);
      newMenuitem = this.menuItemEls[index + 1];
    }
    this.setFocusToMenuitem(newMenuitem);

    return newMenuitem;
  }

  setFocusByFirstCharacter(char) {
    let start, index;

    if (char.length > 1) {
      return;
    }

    char = char.toLowerCase();

    // Get start index for search based on position of currentItem
    start = this.menuItemEls.indexOf(this.currentMenuitemEl) + 1;
    if (start >= this.menuItemEls.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = this.firstChars.indexOf(char, start);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = this.firstChars.indexOf(char, 0);
    }

    // If match was found...
    if (index > -1) {
      this.setFocusToMenuitem(this.menuItemEls[index]);
    }
  }

  // Utilities

  getIndexFirstChars(startIndex, char) {
    for (let i = startIndex; i < this.firstChars.length; i++) {
      if (char === this.firstChars[i]) {
        return i;
      }
    }
    return -1;
  }

  // Popup menu methods

  openPopup() {
    this.menuItemsEl.style.display = 'block';
    this.menuButtonEl.setAttribute('aria-expanded', 'true');
    this.menuItemsEl.focus();
    this.setFocusTofirstMenuitemEl();
  }

  closePopup() {
    if (this.isOpen()) {
      this.menuButtonEl.removeAttribute('aria-expanded');
      this.menuItemsEl.setAttribute('aria-activedescendant', '');
      for (var i = 0; i < this.menuItemEls.length; i++) {
        this.menuItemEls[i].classList.remove(CSS_CLASS.FOCUSED);
      }
      this.menuItemsEl.style.display = 'none';
      this.menuButtonEl.focus();
    }
  }

  isOpen() {
    return this.menuButtonEl.getAttribute('aria-expanded') === 'true';
  }

  // Menu event handlers

  onFocusin() {
    this.menuContainerEl.classList.add(CSS_CLASS.FOCUSED);
  }

  onFocusout() {
    this.menuContainerEl.classList.remove(CSS_CLASS.FOCUSED);
  }

  onButtonKeydown(event) {
    let stopEvent = true;

    switch (event.key) {
      case KEY.SPACE:
      case KEY.ENTER:
      case KEY.ARROW_DOWN:
      case KEY.DOWN:
        this.openPopup();
        this.setFocusToFirstMenuitem();
        break;

      case KEY.ESC:
      case KEY.ESCAPE:
        this.closePopup();
        break;

      case KEY.UP:
      case KEY.ARROW_UP:
        this.openPopup();
        this.setFocusToLastMenuitem();
        break;

      default:
        stopEvent = false;
        break;
    }

    if (stopEvent) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onButtonClick(event) {
    if (this.isOpen()) {
      this.closePopup();
    } else {
      this.openPopup();
    }
    event.stopPropagation();
    event.preventDefault();
  }

  onMenuKeydown(event) {
    let stopEvent = false;

    function isPrintableCharacter(str) {
      return str.length === 1 && str.match(/\S/);
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.shiftKey) {
      if (isPrintableCharacter(key)) {
        this.setFocusByFirstCharacter(key);
        stopEvent = true;
      }

      if (event.key === KEY.TAB) {
        this.closePopup();
        stopEvent = true;
      }
    }

    else {
      switch (event.key) {
        case KEY.SPACE:
        case KEY.ENTER:
          this.closePopup();
          this.onMenuActionConfirmed(this.currentMenuitemEl);
          stopEvent = true;
          break;

        case KEY.ESC:
        case KEY.ESCAPE:
          this.closePopup();
          stopEvent = true;
          break;

        case KEY.UP:
        case KEY.ARROW_UP:
          this.setFocusToPreviousMenuitem();
          stopEvent = true;
          break;

        case KEY.ARROW_DOWN:
        case KEY.DOWN:
          this.setFocusToNextMenuitem();
          stopEvent = true;
          break;

        case KEY.HOME:
        case KEY.PAGE_UP:
          this.setFocusTofirstMenuitemEl();
          stopEvent = true;
          break;

        case KEY.END:
        case KEY.PAGE_DOWN:
          this.setFocusToLastMenuitem();
          stopEvent = true;
          break;

        case KEY.TAB:
          this.closePopup();
          break;

        default:
          if (isPrintableCharacter(key)) {
            this.setFocusByFirstCharacter(key);
            stopEvent = true;
          }
          break;
      }
    }

    if (stopEvent) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onMenuitemMouseover(event) {
    var tgt = event.currentTarget;
    this.setFocusToMenuitem(tgt);
  }

  onMenuitemClick(event) {
    var tgt = event.currentTarget;
    this.closePopup();
    this.onMenuActionConfirmed(tgt);
  }

  onBackgroundMousedown(event) {
    if (!this.menuContainerEl.contains(event.target)) {
      if (this.isOpen()) {
        this.closePopup();
      }
    }
  }
}

window.addEventListener(EVENT.LOAD, function () {

  const outputEl = document.getElementById('action_output');
  const menuButtonEl = document.querySelector('.menu-button-actions');

  outputEl.value = 'none';

  const onMenuActionConfirmed = menuButtonEl => {
    const currentAction = menuButtonEl.textContent.trim();
    outputEl.value = currentAction;
  };

  new MenuButtonActionsActiveDescendant(menuButtonEl, onMenuActionConfirmed);
});
