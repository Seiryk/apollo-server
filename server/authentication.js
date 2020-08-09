/* eslint-disable no-empty */

import jwt from 'jsonwebtoken';
import get from 'lodash/get';

import User from './entities/user/mongoSchema';
import { JWT_SECRET } from './config';
import { HEADER_TOKEN } from './constants';

export const getTokenValidity = (request) => {
  const headerToken = request.headers[HEADER_TOKEN];
  let user = null;
  let valid = false;

  try {
    const expired = Math.floor(Date.now() / 1000) >= get(user, 'exp', 0);
    const isValid = jwt.verify(headerToken, JWT_SECRET);
    user = jwt.decode(headerToken);

    valid = isValid && !expired;
  } catch (error) {
    valid = false;
  }

  return { user, valid };
};

export const googleAuthCallback = async (accessToken, refreshToken, profile, next) => {
  // tode: check if exists, validate with joi, parse json
  const user = {
    email: profile._json.email,
    googleId: profile.id,
    name: get(profile, 'name.givenName', ''),
    surname: get(profile, 'name.familyName', ''),
  };

  let result;

  try {
    result = await User.findOne({ email: user.email });
    if (!result) result = await User.create(user);
    next(null, result.toObject());
  } catch (error) {
    next(error);
  }
};
