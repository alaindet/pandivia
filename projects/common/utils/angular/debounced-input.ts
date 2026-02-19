import { Observable, fromEvent, map, debounceTime, distinctUntilChanged, tap  } from 'rxjs';

/**
 * Subscribes to the "keyup" event of an element (input, textarea) and returns
 * a "debounced" observable from it. Useful with autocompletes
 *
 * @param element ElementRef Target element to register listener on
 * @param delay number Debounce delay in milliseconds
 */
export const createDebouncedInputEvent = (
	element: HTMLInputElement | HTMLTextAreaElement,
	delay: number = 400,
	onInput?: () => void,
): Observable<string> => {

	let source = fromEvent<KeyboardEvent>(element, 'input');

	if (!!onInput) {
		source = source.pipe(tap(() => onInput()));
	}

	return source.pipe(
    debounceTime(delay),
    map(event => (<HTMLInputElement | HTMLTextAreaElement>event.target).value),
    distinctUntilChanged(),
  );
};
