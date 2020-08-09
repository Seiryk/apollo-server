import Technology from './mongoSchema';

export default {
  Query: {
    technology: (root, args, context, info) => Technology.findById(args.id),
    technologies: (root, args, context, info) => Technology.find({}),
  },
  Mutation: {
    addTechnology: (root, args, context, info) => {},
  },
};
