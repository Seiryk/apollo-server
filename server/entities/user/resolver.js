import User from './mongoSchema';

export default {
  Query: {
    user: (root, args) => User.findById(args.id),
  },
};
