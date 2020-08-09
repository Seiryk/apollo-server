import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from './config';


export default (callback) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.use(new OAuth2Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/cb',
    },
    callback,
  ));
};
