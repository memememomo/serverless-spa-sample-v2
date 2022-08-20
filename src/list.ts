import AWS from 'aws-sdk';
import {APIGatewayEvent} from "aws-lambda";
import {getAuthFromHeader} from "./auth";

// DynamoDBへアクセスするClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = async (event: APIGatewayEvent) => {
  // Authorizationヘッダーからユーザー情報を抽出
  const auth = getAuthFromHeader(event);

  // DynamoDBに渡すパラメータを設定
  const params = {
    // DynamoDBテーブル名
    TableName: process.env.tableName as string,
    // ユーザーが投稿したノート一覧を取得するため、キーとしてユーザーIDを設定
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": auth.sub,
    },
  };
  // DynamoDBのデータ一覧を取得する処理
  const results = await dynamoDb.query(params).promise();

  // HTTPレスポンス
  return {
    statusCode: 200,
    body: JSON.stringify(results.Items),
  };
};