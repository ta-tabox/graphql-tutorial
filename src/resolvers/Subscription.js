function newLinkSubscribe(parent, args, context) {
  // subscribe側 publisherでも同じトリガー名で受信用の設定を作成する
  return context.pubsub.asyncIterator("NEW_LINK");
}

const newLink = {
  // 受け取る
  subscribe: newLinkSubscribe,
  // 受け取ったデータを返す
  resolve: (payload) => {
    return payload;
  },
};

function newVoteSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator("NEW_VOTE");
}

const newVote = {
  // 受け取る
  subscribe: newVoteSubscribe,
  // 受け取ったデータを返す
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newLink,
  newVote,
}
