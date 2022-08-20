import {useForm, Controller } from "react-hook-form";
import {
  Button,
  Grid,
  TextField
} from "@mui/material";
import {useRouter} from "next/router";
import {Note, NoteKey} from '../../src/note';
import React from "react";
import {createNote, toUTC, updateNote} from "../src/api";

// ノートの内容を入力するフォームのコンポーネント
// 新規作成と更新で共通で使用する。

type NoteProps = {
  // 新規作成か更新かで切り替える
  title: string;
  // 更新の場合は、すでにある内容をフォームに表示する
  note?: Note;
};


type NoteFormInput = {
  // 編集した内容
  content: string;
};

const NoteForm = (props: NoteProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { control, handleSubmit } = useForm<NoteFormInput>();
  const router = useRouter();
  const note = props.note;

  // 登録または編集ボタンを押したときの処理
  const onSubmit = async (data: NoteFormInput) => {
    setIsLoading(true);
    if (note) {
      await update(data);
    } else {
      await create(data);
    }
    return router.push('/notes');
  };

  // 新規作成処理
  const create = (data: NoteFormInput) => {
    return createNote({content: data.content});
  };

  // 更新処理
  const update = async (data: NoteFormInput) => {
    if (!note) return;
    return updateNote({
      noteId: note.noteId,
      content: data.content,
    });
  };

  // 編集時のみ、この順番で登録されている内容を表示する
  const noteKeys: NoteKey[] = ['noteId', 'userId', 'userName', 'createdAt'];

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>{props.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justifyContent="center" spacing={1}>
          <Grid item xs={12}>
            <div style={{ textAlign: 'center' }}>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <TextField
                    {...field}
                    aria-label="minimum height"
                    minRows={3}
                    style={{width: 500, margin: '10px'}}
                    defaultValue={note ? note.content : ''}
                    label="ノート"
                  />
                )}
              />
            </div>
          </Grid>
          {note ?
            (
              <Grid container>
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
              </Grid>
            )
            :
            (<></>)
          }
          <Grid item>
            <div>
              <Button
                variant="contained"
                disabled={isLoading}
                onClick={router.back}
              >キャンセル</Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
                style={{ marginLeft: '5px'}}
              >{note ? '更新' : '投稿'}</Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default NoteForm;