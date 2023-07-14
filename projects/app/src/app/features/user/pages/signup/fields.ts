export const SIGNUP_FIELD_NAME = {
  id: 'name',
  htmlId: 'field-name',
  errors: {
    REQUIRED: 'field-name-required',
    LENGTH: 'field-name-length',
  },
} as const;

export const SIGNUP_FIELD_EMAIL = {
  id: 'email',
  htmlId: 'field-email',
  errors: {
    REQUIRED: 'field-email-required',
    EMAIL: 'field-email-invalid-email',
  },
} as const;

export const SIGNUP_FIELD_PASSWORD = {
  id: 'password',
  htmlId: 'field-password',
  errors: {
    REQUIRED: 'field-password-required',
  },
} as const;

export const SIGNUP_FIELD = {
  NAME: SIGNUP_FIELD_NAME,
  EMAIL: SIGNUP_FIELD_EMAIL,
  PASSWORD: SIGNUP_FIELD_PASSWORD,
} as const;
