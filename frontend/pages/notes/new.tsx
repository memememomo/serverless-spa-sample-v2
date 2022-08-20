import NoteForm from "../../components/note-form-input";
import Layout from "../../components/layout";
import AuthCheck from "../../components/auth-check";

// ノートの新規登録フォーム画面
const NoteNew = () => {
  return (
    <Layout title="ノート新規登録">
      <NoteForm title="ノート新規登録"/>
    </Layout>
  );
};

// ログインが必須の画面のため、AuthCheckコンポーネントで囲って、ログインチェックをする
const NoteNewAuth = () => {
  return <AuthCheck><NoteNew/></AuthCheck>
};

export default NoteNewAuth;