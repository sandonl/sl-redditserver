import { IDatabaseDriver, EntityManager, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

// Custom types for MyContext
export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Session };
  redis: Redis;
  res: Response;
};

declare module "express-session" {
  interface Session {
    userId: number;
    user: Object;
  }
}
export default MyContext;
