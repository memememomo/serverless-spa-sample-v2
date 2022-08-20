import * as sst from "@serverless-stack/resources";
import {ApiAuthorizationType, Auth, NextjsSite, Table, TableFieldType} from "@serverless-stack/resources";
import * as apigAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers";
import * as cognito from '@aws-cdk/aws-cognito';

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // DynamoDBテーブルの作成
    const table = new Table(this, "Notes", {
      // フィールドの定義
      fields: {
        userId: TableFieldType.STRING,
        noteId: TableFieldType.STRING,
      },
      // インデックスの設定(パーティションキーとソートキー)
      primaryIndex: {
        partitionKey: "userId",
        sortKey: "noteId" ,
      }
    });

    // Authの設定
    const auth = new Auth(this, "Auth", {
      // Cognitoを使用
      cognito: {
        // ユーザープールの設定
        userPool: {
          signInAliases: { email: true },
        },
      },
    });

    // API Gatewayの設定
    const api = new sst.Api(this, "Api", {
      // Cognitoのユーザープールと連携設定
      defaultAuthorizer: new apigAuthorizers.HttpUserPoolAuthorizer({
        userPool: auth.cognitoUserPool as cognito.UserPool,
        userPoolClient: auth.cognitoUserPoolClient as cognito.UserPoolClient,
      }),
      // JWT認証を使用
      defaultAuthorizationType: ApiAuthorizationType.JWT,
      // Lambdaに設定する環境変数
      defaultFunctionProps: {
        environment: {
          tableName: table.dynamodbTable.tableName,
        },
      },
      // APIのルートとLambdaを対応付ける設定
      routes: {
        "GET /notes": "src/list.main",
        "POST /notes": "src/create.main",
        "GET /notes/{id}": "src/get.main",
        "PUT /notes/{id}": "src/update.main",
        "DELETE /notes/{id}": "src/delete.main",
      },
    });
    // LambdaがDynamoDBにアクセスできる権限の設定
    api.attachPermissions([table]);

    // SPAの設定(Next.js)
    const site = new NextjsSite(this, "Site", {
      // SPAのディレクトリパス
      path: "frontend",
      // SPAに設定する環境変数
      environment: {
        API_ENDPOINT: api.url,
        REGION: scope.region,
        USER_POOL_ID: auth.cognitoUserPool?.userPoolId as string,
        IDENTITY_POOL_ID: auth.cognitoCfnIdentityPool.ref,
        USER_POOL_CLIENT_ID:  auth.cognitoUserPoolClient?.userPoolClientId as string,
      },
    });

    // 上記で作成したリソースの情報を標準出力
    this.addOutputs({
      "URL": site.url,
      "ApiEndpoint": api.url,
      "UserPoolId": auth.cognitoUserPool?.userPoolId as string,
      "IdentityPoolId": auth.cognitoCfnIdentityPool.ref,
      "UserPoolClientId": auth.cognitoUserPoolClient?.userPoolClientId as string,
    });
  }
}
