import { gql } from 'apollo-server-express';

import technology from './technology/typeDefs';
import company from './company/typeDefs';
import profile from './profile/typeDefs';

const root = gql`
type Query {
  _: String
}
type Mutation {
  _: String
}
type Subscription {
  _: String
}
`;

export default [
  root,
  company,
  profile,
  technology,
];
