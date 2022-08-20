import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Amplify from 'aws-amplify';

// SSR処理のときに、Amplifyの設定エラーが出ないようにする
// windowが定義されているかどうかでSSR処理で実行されているかどうかを確認する
if (typeof window !== "undefined") {
  // AmplifyにCognito関係の値を設定する
  // 値は環境変数から取得する
  Amplify.configure({
    aws_cognito_region: process.env.REGION,
    aws_user_pools_id: process.env.USER_POOL_ID,
    aws_user_pools_web_client_id: process.env.USER_POOL_CLIENT_ID,
    ssr: true,
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}

export default MyApp
