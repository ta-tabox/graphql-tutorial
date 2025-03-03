const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

// リゾルバ関係のファイル
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const Vote = require("./resolvers/Vote");

// サブスクリプションの実装
// Publisher(送信者)/Subscriber(受信者)
const { PubSub } = require("apollo-server")

const prisma = new PrismaClient();
const pubsub = new PubSub()

// スキーマの定義に合わせる、実態を定義する
// リゾルバ関数
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote,
};

// ApolloServerのインスタンス化
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーを起動中・・・`));
