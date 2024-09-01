// 誰によって投稿されたかのリゾルバ
// parent.idで親の階層のidを指定している
function postedBy(parent, args, context) {
  return context.prisma.link
    .findUnique({
      where: { id: parent.id },
    })
    .postedBy();
}

/// 投票一覧を取得するリゾルバ
function votes(parent, args, context) {
  return context.prisma.link
    .findUnique({
      where: { id: parent.id },
    })
    .votes();
}

module.exports = {
  postedBy,
  votes,
};
