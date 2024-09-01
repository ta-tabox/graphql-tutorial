// 投票されたリンクを返すリゾルバ
function link(parent, args, context) {
  return context.prisma.vote
    .findUnique({
      where: { id: parent.id },
    })
    .link();
}

// 投票したユーザーを返すリゾルバ
function user(parent, args, context) {
  return context.prisma.vote
    .findUnique({
      where: { id: parent.id },
    })
    .user();
}

module.exports = {
  link,
  user,
}
