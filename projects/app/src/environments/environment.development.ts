import { firebaseConfig } from './firebase';

export const environment = {
  production: true,
  appName: 'Pandivia',
  firebase: {
    config: firebaseConfig,
    useEmulators: true,
  },
};
