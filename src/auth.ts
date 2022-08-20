import {APIGatewayEvent} from "aws-lambda";
import jwt_decode from "jwt-decode";

// JWTからデコードしたデータに含まれているものの中で、アプリで使用するデータ
type Auth = {
  // Cognito上のユーザーID
  sub: string;
  // ユーザー名
  name: string;
};

// Authorizationヘッダに含まれるトークンからユーザー情報を抽出する
export const getAuthFromHeader = (event: APIGatewayEvent) => {
  // Authorizationヘッダから値を取得する
  const h = event.headers['authorization'];
  // 「Bearer xxxxx」のxxxx(トークン部)を取得する
  const token = h?.split(' ')[1] || '';
  // JWTデコード
  return jwt_decode<Auth>(token);
};