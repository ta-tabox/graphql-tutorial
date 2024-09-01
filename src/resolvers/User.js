function links(parent, args, context) {
  return context.prisma.user
    .findUnique({
      where: { id: parent.id },
    })
    .link();
}

module.exports = {
  links,
};
