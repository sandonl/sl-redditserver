require("dotenv-safe").config();
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import dataSource from "./db_config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";
import { createUserLoader } from "./utils/createUserLoader";

// rerun
const main = async () => {
  // TypeORM Datasource Initialise connection to the DB
  await dataSource.initialize();

  // Use to run any new migrations:
  await dataSource.runMigrations();

  // Use to delete all posts:
  // await Post.delete({});

  // Initiate an App
  const app = express();

  // Create Redis Store and Client
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  // const redisClient = createClient({ legacyMode: true });
  // redis.connect().catch(console.error);

  //  Cookie issues:
  app.set("trust proxy", 1);

  // Applies middleware to all routes
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // ms, seconds, minutes, hours, days, years 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // _prod__ cookie only works in https
        domain: __prod__ ? ".sandonl.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION!,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      upvoteLoader: createUpvoteLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT_NO!), () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
