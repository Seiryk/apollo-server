import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import resolvers from './entities/baseResolvers';
import typeDefs from './entities/baseTypeDefs';
import { getTokenValidity } from './authentication';
import addRouts from './routs-config';
import {
  port,
  NODE_ENV,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  REDIRECT_URL,
} from './config';


(async () => {
  try {
    await mongoose.connect(
      `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    const app = express();

    const server = new ApolloServer({
      cors: {
        origin: REDIRECT_URL,
        credentials: true,
      },
      typeDefs,
      resolvers,
      playground: NODE_ENV === 'development',
      context: ({ req, res }) => {
        const { valid, user } = getTokenValidity(req);
        return {
          req, res, valid, user,
        };
      },
    });

    addRouts(app);


    server.applyMiddleware({ app });

    app.listen(
      { port },
      () => console.log(`🚀 Server ready at http://*:${port}${server.graphqlPath}`),
    );
  } catch (error) {
    console.log(`db connection unsuccessful ended with error ${error}`);
  }
})();
