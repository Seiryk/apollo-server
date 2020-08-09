import passport from 'passport';

import authentication from './routes/authentication';
import authConfigInit from './auth-config';
import { googleAuthCallback } from './authentication';

export default (app) => {
  authConfigInit(googleAuthCallback);

  app.use(passport.initialize());

  app.use('/auth', authentication);
};
