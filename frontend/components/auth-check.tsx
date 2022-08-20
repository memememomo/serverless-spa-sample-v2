import {useRouter} from "next/router";
import {Auth} from "aws-amplify";
import React, {useEffect, useState} from "react";

// ログインチェック処理
// ログインしていれば、画面を表示。
// ログインしていなければ、ログイン画面にリダイレクト。

// 画面情報(children)をPropで受け取る
type Props = {
  children: JSX.Element;
};
const AuthCheck: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  // 画面読み込み後に実行する処理
  useEffect( () => {
    const f = async () => {
      // ログイン情報を取得
      const info = await Auth.currentUserInfo();
      setUser(info?.attributes.name);
      setLoading(false);
    };
    f();
  }, []);

  // ログイン情報取得中
  if (loading) return <div>Loading...</div>

  // ユーザー情報を取得できているかどうか
  if (!process.env.DISABLE_AUTH && !user) {
    // ログイン画面にリダイレクト
    router.replace('/login');
    return <div></div>
  }

  // 画面を表示
  return children;
};

export default AuthCheck;