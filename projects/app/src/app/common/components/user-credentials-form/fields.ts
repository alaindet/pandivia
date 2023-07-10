export const USER_CREDENTIALS_FIELD_EMAIL = {
  id: 'email',
  htmlId: 'field-email',
  errors: {
    REQUIRED: 'field-email-required',
    EMAIL: 'field-email-invalid-email',
  },
} as const;

export const USER_CREDENTIALS_FIELD_PASSWORD = {
  id: 'password',
  htmlId: 'field-password',
  errors: {
    REQUIRED: 'field-password-required',
  },
} as const;

export const USER_CREDENTIALS_FIELD = {
  EMAIL: USER_CREDENTIALS_FIELD_EMAIL,
  PASSWORD: USER_CREDENTIALS_FIELD_PASSWORD,
} as const;
