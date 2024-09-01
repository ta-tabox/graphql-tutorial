const jwt = require("jsonwebtoken");

APP_SECRET = "Graphql-is-aw3some"; // 仮で適当に秘密鍵を用意

// トークンを復号する
function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

// ユーザーIDを取得するための関数
function getUserId(req, authToken) {
  if (req) {
    // ヘッダーを確認する(認証権限)
    const authHeader = req.headers.authorization;
    // 権限あり
    let token
    if (authHeader) {
      token = authHeader.replace("Bearer", "");
      if (!token) {
        throw new Error("トークンが見つかりませんでした");
      }
    }
    // トークンを復号する
    const { userId } = getTokenPayload(token);
    return userId;
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("認証権限がありません");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
