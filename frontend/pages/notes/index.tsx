import {Note} from '../../../src/note';
import Link from "next/link";
import Layout from "../../components/layout";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import AuthCheck from "../../components/auth-check";
import {deleteNoteById, getNotes, toUTC} from "../../src/api";
import {
  Button, ButtonGroup, FormControlLabel,
  Grid,
  Paper, Radio,
  RadioGroup,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ErrorMessage from "../../components/error-message";
import {handleError} from "../../src/error";

// ノート一覧画面

const NotesIndex = () => {
  const [noteId, setNoteId] = useState('');
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  // 画面が表示されたときに実行される
  useEffect(() => {
    if (notes != null) return;
    const f = async () => {
      try {
        // APIでノート一覧を取得する
        const res = await getNotes();
        setNotes(res);
      } catch (err) {
        handleError(err, setErrorMessage);
        setNotes([]);
      }
    };
    f();
  });

  // ラジオボタンで選択されたノートのIDを変数にセットする
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setNoteId((ev.target as HTMLInputElement).value);
  };

  // 選択されたノートを削除する処理
  const handleDelete = async () => {
    // 実行前の確認プロンプト
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    try {
      // APIで削除する
      await deleteNoteById(noteId);
      // 削除した後は、変数を初期化する
      setNoteId('');
      setNotes([]);
      // 最新のノート一覧データをAPIで取得する
      const notes = await getNotes();
      // 新しいノート一覧データを変数にセットする
      setNotes(notes);
    } catch (err) {
      handleError(err, setErrorMessage);
    }
  };

  // 詳細ボタンを押下したとき、選択したノートの詳細情報画面に遷移する
  const handleDetail = () => {
    return router.push(`/notes/${noteId}`);
  };

  // 作成ボタンを押下したとき、新規作成画面に遷移する
  const handleCreate = () => {
    return router.push(`/notes/new`)
  };

  // 編集ボタンを押下したとき、編集画面に遷移する
  const handleEdit = () => {
    return router.push(`/notes/${noteId}/edit`);
  };

  // APIでノート一覧データを取得中の間、Loading文字列を表示する
  if (!notes) return <div>Loading...</div>

  return (
    <Layout title="ノート一覧">
      <div>
        <ErrorMessage message={errorMessage}/>
        <h2 style={{ textAlign:"center" }}>
          ノート一覧
        </h2>
        <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <ButtonGroup>
              <Button variant="outlined" onClick={handleCreate}>作成</Button>
              <Button variant="outlined" disabled={!noteId} onClick={handleDetail}>詳細</Button>
              <Button variant="outlined" disabled={!noteId} onClick={handleEdit}>編集</Button>
              <Button variant="outlined" disabled={!noteId} onClick={handleDelete}>削除</Button>
            </ButtonGroup>
            <RadioGroup value={noteId} onChange={handleChange}>
              <TableContainer component={Paper}>
                <Table area-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>選択</TableCell>
                      <TableCell>ノートID</TableCell>
                      <TableCell>ユーザー名</TableCell>
                      <TableCell>本文</TableCell>
                      <TableCell>作成日時</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notes.map((note: Note) => (
                      <TableRow
                        key={note.noteId}
                      >
                        <TableCell>
                          <FormControlLabel
                            value={note.noteId}
                            control={<Radio />}
                            label=""
                          />
                        </TableCell>
                        <TableCell>
                          <Link href="/notes/[id]" as={`/notes/${note.noteId}`}>
                            {note.noteId}
                          </Link>
                        </TableCell>
                        <TableCell>{note.userName}</TableCell>
                        <TableCell>{note.content}</TableCell>
                        <TableCell>{toUTC(note.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </RadioGroup>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </div>
    </Layout>
  );
};

// ログインが必須の画面のため、AuthCheckコンポーネントで囲って、ログインチェックをする
const NotesIndexAuth = () => {
  return <AuthCheck><NotesIndex/></AuthCheck>
}

export default NotesIndexAuth;