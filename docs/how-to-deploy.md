- Create a user on Firebase Auth online via the web console
- Get that user's UID
- Create `service-account.json` file by creating one from Firebase > Project Settings > Service Account (tab)
- Run the local script
  ```
  npm run firebase:admin -- <VERY_LONG_USER_UID> <USER_DISPLAY_NAME>
  # npm run firebase:admin -- ksjdlkjioejwqjkldsa "John Smith"
  ```
- Simply deploy the application via
  ```
  npm version minor
  npx firebase login --reauth # Only if this command failed previously
  npx firebase deploy
  ```
