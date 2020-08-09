// import { UserInputError } from 'apollo-server-express';
import Profile from './mongoSchema';
import Company from '../company/mongoSchema';
import Technology from '../technology/mongoSchema';

export default {
  Query: {
    profile: async (root, args, context, info) => {
      const data = await Profile.findById(args.id);

      return data;
    },
    profiles: async () => {
      const data = await Profile.find({});

      return data;
      // return data;
    },
  },
  Mutation: {
    addProfile: (root, args, context, info) => {
      // const { error, value } = addUserJoi.validate(args, { abortEarly: false });
      // if (error) throw new UserInputError(error);
      // return User.create(value);
    },
  },
  Profile: {
    company: (parent) => Company.findById(parent.company),
    expertise: async (parent) => {
      const data = await Technology.find().where('_id').in(parent.expertise).exec();
      return data;
    },
  },
  Experience: {
    company: (parent) => Company.findById(parent.company),
  },
};
