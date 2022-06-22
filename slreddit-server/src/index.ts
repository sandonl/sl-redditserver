import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME } from "./constants";
import dataSource from "./db_config";
// import { Post } from "./entities/Post";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

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
  const redis = new Redis();
  // const redisClient = createClient({ legacyMode: true });
  // redis.connect().catch(console.error);

  // Applies middleware to all routes
  app.use(
    cors({
      origin: "http://localhost:3000",
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
        secure: false, // _prod__ cookie only works in https
      },
      saveUninitialized: false,
      secret: "keyboard cat heahfa",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
