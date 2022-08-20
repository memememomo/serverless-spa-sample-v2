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
    // 取得するデータのキーを設定
    Key: {
      userId: auth.sub,
      noteId: event.pathParameters?.id,
    },
  };
  // DynamoDBのデータを取得する処理
  const results = await dynamoDb.get(params).promise();

  // HTTPレスポンス(データを取得できた場合とできなかった場合で分岐)
  return results.Item ? {
    statusCode: 200,
    body: JSON.stringify(results.Item),
  } : {
    statusCode: 404,
    body: JSON.stringify({ error: true }),
  };
};