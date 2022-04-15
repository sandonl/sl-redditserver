import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const dataSource = new DataSource({
  type: "postgres",
  database: "slreddit",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [Post, User],
});

export default dataSource;
