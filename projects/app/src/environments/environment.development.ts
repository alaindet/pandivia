import { firebaseConfig } from './firebase';

export const environment = {
  production: false,
  appName: 'Pandivia',
  firebase: {
    config: firebaseConfig,
    useEmulators: true,
  },
};
