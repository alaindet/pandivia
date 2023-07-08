export type UserCredentials = {
  email: string;
  password: string;
};

export type UserData = {
  uid: string; // short hash (28 characters)
  email: string; // user@example.com
  emailVerified: boolean;
  displayName: string; // John Smith
  isAnonymous: boolean;
  providerData: {
    providerId: string; // 'password' | '...'
    uid: string; // user@example.com
    displayName: string; // John Smith
    email: string; // user@example.com
    phoneNumber: number | null;
    photoURL: string | null;
  }[];
  stsTokenManager: {
    refreshToken: string; // hash
    accessToken: string; // hash
    expirationTime: number; // 1688806159434
  };
  createdAt: string; // '1688685905157'
  lastLoginAt: string; // '1688802559431'
  apiKey: string; // hash
  appName: string;

  // This is an extra key
  isAdmin: boolean;
};

export type UserDisplayData = Pick<UserData, (
  | 'email'
  | 'displayName'
  | 'createdAt'
  | 'lastLoginAt'
  | 'isAdmin'
)>;
