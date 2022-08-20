import { useRouter } from 'next/router';
import {Note, NoteKey} from '../../../../src/note';
import Layout from "../../../components/layout";
import {Button, Grid, TextField} from "@mui/material";
import AuthCheck from "../../../components/auth-check";
import {getNoteById, toUTC} from "../../../src/api";
import {useEffect, useState} from "react";
import {handleError} from "../../../src/error";
import ErrorMessagePage from "../../../components/error-message-page";

// ノート詳細画面

const NotePage = () => {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const noteId = router.query.id as string;

  // 画面が表示されたときに実行される
  useEffect(() => {
    // ノートがすでに読み込まれている場合は、なにもしない
    if (note != null) return;
    const f = async () => {
      try {
        // APIでノート詳細情報を取得する
        const res = await getNoteById(noteId);
        setNote(res);
      } catch (err) {
        handleError(err, setErrorMessage);
      }
    };
    f();
  });

  // エラーメッセージがセットされている場合、エラーメッセージ画面を表示する
  if (errorMessage) return (
    <ErrorMessagePage message={errorMessage}/>
  );

  // APIでノート詳細情報を取得中の間は、Loading文字を表示する
  if (!note) return <div>Loading...</div>

  // この順番で、ノート詳細情報を表示する
  const noteKeys: NoteKey[] = ['noteId', 'userId', 'userName', 'content', 'createdAt'];

  return (
    <Layout title={`ノート詳細(${note.noteId})`}>
      <h2 style={{ textAlign: 'center' }}>ノート詳細(${note.noteId})</h2>
      <Grid container spacing={1}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <div style={{ textAlign: 'center' }}>
            {noteKeys.map((k: NoteKey) => (
              <div key={k}>
                <TextField
                  label={k}
                  defaultValue={k === 'createdAt' ? toUTC(note[k]) : note[k]}
                  disabled={true}
                  style={{width: 500, margin: '10px'}}
                />
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={12}>
          <div style={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={router.back}
            >戻る</Button>
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

// ログインが必須の画面のため、AuthCheckコンポーネントで囲って、ログインチェックをする
const NotePageAuth = () => {
  return <AuthCheck><NotePage/></AuthCheck>
};

export default NotePageAuth;