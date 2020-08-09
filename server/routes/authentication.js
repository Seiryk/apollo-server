import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import {
  JWT_SECRET,
  REDIRECT_URL,
} from '../config';
import {
  HEADER_TOKEN,
} from '../constants';


const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/google/cb',
  passport.authenticate('google'),
  (req, res) => {
    const expDate = Math.floor(Date.now() / 1000) + (60 * 60);
    const token = jwt.sign({
      exp: expDate,
      ...req.user,
    }, JWT_SECRET);
    res.redirect(`${REDIRECT_URL}?${HEADER_TOKEN}=${token}`);
  },
);


module.exports = router;
