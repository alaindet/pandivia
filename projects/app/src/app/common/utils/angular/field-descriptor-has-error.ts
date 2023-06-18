import { ValidationErrors } from "@angular/forms";

// Ex.:
// fieldHasError({ max: '...' }, 'required') // false
// fieldHasError({ required: '...' }, 'required') // true
// fieldHasError({ minlength: '...' }, 'minlength,maxlength') // true
export function fieldDescriptorHasError(
  errors: ValidationErrors,
  errorNames: string,
): boolean {

  if (!errorNames.indexOf(',')) {
    return !!errors[errorNames];
  }

  return errorNames.split(',').some(err => errors![err]);
}