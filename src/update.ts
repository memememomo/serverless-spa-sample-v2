import AWS from 'aws-sdk';
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
    // 更新するデータのキーを設定
    Key: {
      userId: auth.sub,
      noteId: event.pathParameters?.id,
    },
    // 更新するデータを設定
    UpdateExpression: "SET content = :content",
    ExpressionAttributeValues: {
      ":content": data.content || null,
    },
    // 更新後はすべての項目を含めたデータが返ってくるように設定
    ReturnValues: "ALL_NEW",
  };

  // DynamoDBのデータを更新する処理
  const results = await dynamoDb.update(params).promise();

  // HTTPレスポンス
  return {
    statusCode: 200,
    body: JSON.stringify(results.Attributes),
  };
};
