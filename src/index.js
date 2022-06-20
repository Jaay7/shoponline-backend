import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import cors from 'cors';

require('dotenv').config();

const Server = async () => {
  const app = express();

  var corsOptions = {
    origin: ['http://localhost:3000', 'https://shoponline-alpha.vercel.app/'],
  };
  app.disable('x-powered-by');

  app.use(cors(corsOptions));
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
  });
  await server.start();
  server.applyMiddleware({ app });

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shoponline', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

  app.listen({ port: process.env.PORT || 3030 }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 3030}${server.graphqlPath}`);
  });
};

Server();