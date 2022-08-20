import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import React, {useEffect} from "react";
import {AuthState, onAuthUIStateChange} from "@aws-amplify/ui-components";
import {useRouter} from "next/router";

// ログインフォーム画面

const LoginIndex = () => {
  const [authState, setAuthState] = React.useState<AuthState>();
  // eslint-disable-next-line @typescript-eslint/ban-types
  const [user, setUser] = React.useState<object | undefined>();
  const router = useRouter();

  // 画面が表示されたときに実行される処理
  useEffect(() => {
    // ログイン状態が更新された場合に、ログイン情報をセットする
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  });

  // ログインした場合、トップページにリダイレクトする
  if (authState === AuthState.SignedIn && user) {
     router.replace('/');
     return <div></div>
  }

  // ログインしていない場合、Amplifyでログインフォームを表示する
  return (
    <AmplifyAuthenticator>
    </AmplifyAuthenticator>
  )
};

export default LoginIndex;