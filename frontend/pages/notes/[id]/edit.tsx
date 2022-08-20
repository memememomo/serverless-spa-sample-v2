import {useRouter} from "next/router";
import {Note} from '../../../../src/note';
import Layout from "../../../components/layout";
import NoteForm from "../../../components/note-form-input";
import AuthCheck from "../../../components/auth-check";
import {getNoteById} from "../../../src/api";
import {useEffect, useState} from "react";
import {handleError} from "../../../src/error";
import ErrorMessagePage from "../../../components/error-message-page";

// 編集画面

const NoteEdit = () => {
  const router = useRouter();
  const noteId = router.query.id as string;
  const [note, setNote] = useState<Note | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();

  // 画面が表示されたときに実行される処理
  useEffect(() => {
    if (note != null) return;
    const f = async () => {
      try {
        // APIでノートの情報を取得する
        const res = await getNoteById(noteId);
        setNote(res);
      } catch (err) {
        handleError(err, setErrorMessage);
      }
    };
    f();
  })

  // noteIdがセットされていない場合は、ノート一覧ページにリダイレクト
  if (!noteId) {
    router.replace('/notes');
    return <></>;
  }

  // エラーメッセージがセットされている場合、エラーメッセージ画面を表示する
  if (errorMessage) return (
    <ErrorMessagePage message={errorMessage}/>
  );

  // APIでノート情報を取得している間、Loading文字を表示する
  if (!note) return <div>Loading...</div>

  // ノート情報をフォームに表示する
  return (
    <Layout title={`ノート編集(${note.noteId})`}>
      <NoteForm title={`ノート編集(${note.noteId})`} note={note}/>
    </Layout>
  )
};

// ログインが必須の画面のため、AuthCheckコンポーネントで囲って、ログインチェックをする
const NoteEditAuth = () => {
  return <AuthCheck><NoteEdit/></AuthCheck>
}

export default NoteEditAuth;