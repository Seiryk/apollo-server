import Company from './mongoSchema';
import Profile from '../profile/mongoSchema';

export default {
  Query: {
    company: (root, args, context, info) => Company.findById(args.id),
    companies: (root, args, context, info) => Company.find({}),
  },
  Mutation: {
    addCompany: (root, args, context, info) => Company.create(args),
  },
  Company: {
    employees: (parent) => Profile.find().where('_id').in(parent.employees).exec(),
  },
};
