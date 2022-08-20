import AWS from 'aws-sdk';
import * as uuid from 'uuid';
import {APIGatewayEvent} from "aws-lambda";
import {getAuthFromHeader} from "./auth";

// DynamoDBへアクセスするClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = async (event: APIGatewayEvent) => {
  // JSON本体をパース
  const data = JSON.parse(event.body as string);

  // Authorizationヘッダーからユーザー情報を抽出
  const auth = getAuthFromHeader(event);

  // DynamoDBに渡すパラメータを設定
  const params = {
    // DynamoDBテーブル名
    TableName: process.env.tableName as string,
    // 保存するデータ
    Item: {
      userId: auth.sub,
      userName: auth.name,
      noteId: uuid.v1(),
      content: data.content,
      createdAt: Date.now(),
    },
  };
  // DynamoDBに保存する処理
  await dynamoDb.put(params).promise();

  // HTTPレスポンス
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  }
};