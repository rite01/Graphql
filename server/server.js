import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./schemaGql.js";

import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

import jwt from "jsonwebtoken";


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});

//

import "./models/Quote.js";
import "./models/User.js";

import resolvers from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = jwt.verify(authorization, JWT_SECRET);
      return { userId };
    }
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server.listen().then(({ url }) => {
  console.log(`server ready at ${url}`);
});
