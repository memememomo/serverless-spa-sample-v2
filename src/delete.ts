import AWS from 'aws-sdk';
import {APIGatewayProxyEvent} from "aws-lambda";
import {getAuthFromHeader} from "./auth";

// DynamoDBへアクセスするClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = async (event: APIGatewayProxyEvent) => {
  // Authorizationヘッダーからユーザー情報を抽出
  const auth = getAuthFromHeader(event);

  // DynamoDBに渡すパラメータを設定
  const params = {
    // DynamoDBテーブル名
    TableName: process.env.tableName as string,
    // 削除するデータのキーを設定
    Key: {
      userId: auth.sub,
      noteId: event.pathParameters?.id,
    },
  };
  // DynamoDBのデータを削除する処理
  await dynamoDb.delete(params).promise();

  // HTTPレスポンス
  return {
    statusCode: 200,
    body: JSON.stringify({ status: true }),
  };
}