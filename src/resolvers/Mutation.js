const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../utils");

// ユーザーの新規登録のリゾルバ
async function signup(parent, args, context) {
  // パスワードの設定
  const password = await bcrypt.hash(args.password, 10);

  // ユーザーの新規作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      // パスワードをハッシュ化したものに変更
      password,
    },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// ユーザーログイン
async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("そのようなユーザーは存在しません");
  }

  // パスワードの比較
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("無効なパスワードです");
  }

  // パスワードが正しいとき
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// ニュースを投稿するリゾルバ
async function post(parent, args, context) {
  const { userId } = context;

  // 新しいリンクを変数に代入
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  // pubsubを使用して送信
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

// 投票するリゾルバ
async function vote(parent, args, context) {
  const userId = context.userId;

  // すでに投票が存在するか
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  // 2回投票を防ぐ
  if (Boolean(vote)) {
    throw new Error(`すでにその投稿には投票されています: ${args.linkId}`);
  }

  // 投票する
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  // 送信
  context.pubsub.publish("NWE_VOTE", newVote);

  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote,
};
