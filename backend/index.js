import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import passport from 'passport';
import { buildContext } from "graphql-passport";
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';

import { ApolloServer } from "@apollo/server"
// import { startStandaloneServer } from "@apollo/server/standalone"

import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const app = express();

import mergedResolvers from "./resolvers/index.js"
import mergedTypeDefs from "./typeDefs/index.js"
import { connectDB } from './db/connectDB.js';
import {configurePassport} from './passport/passport.config.js';
dotenv.config();
configurePassport();

const httpServer = http.createServer(app);

const MongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
  uri:process.env.MONGO_URL,
  collection:"sessions",
})


store.on("error",(err)=>console.log(err));


app.use(session({secret:process.env.SESSION_SECRET,
resave:false,
saveUninitialized:false,
cookie:{
  maxAge:1000 *60*60*24*7,
  httpOnly:true,
},
store:store
}))


app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs:mergedTypeDefs,
  resolvers:mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})


// Ensure we wait for our server to start
await server.start();

// const { url } = await startStandaloneServer(server)



// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/graphql',
  cors({
    origin:"http://localhost:3000",
    credentials:true
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req,res }) => buildContext({ req, res }),
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

await connectDB();
console.log(`🚀 Server ready at http://localhost:4000/`);