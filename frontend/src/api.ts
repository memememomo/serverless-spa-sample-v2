import {Auth} from "aws-amplify";
import {Note} from '../../src/note';

// APIのエンドポイント
const baseUrl = () => process.env.API_ENDPOINT;

// Cognitoから受け取ったトークンをAuthorizationヘッダに設定
const authHeader = async () => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ノートを取得するAPIのURL
const notesUrl = () => `${baseUrl()}/notes`;
// IDを指定してノートを取得するAPIのURL
const noteByIdUrl = (noteId: string) => `${baseUrl()}/notes/${noteId}`;

// ノート一覧を取得するAPI
export const getNotes = async () => {
  const h = await authHeader();
  const res = await fetch(notesUrl(), {
    headers: {
      ...h,
    },
  });
  return res.json();
};

// IDを指定してノートを取得するAPI
export const getNoteById = async (noteId: string): Promise<Note> => {
  const h = await authHeader();
  const res = await fetch(noteByIdUrl(noteId), {
    headers: {
      ...h,
    },
  });
  return res.json();
};

// IDを指定してノートを削除するAPI
export const deleteNoteById = async (noteId: string) => {
  const h = await authHeader();
  await fetch(noteByIdUrl(noteId), {
    method: 'DELETE',
    headers: {
      ...h,
    },
  });
};

// ノートを新規作成するときのデータ
type CreateNoteInput = {
  content: string;
};

// ノートを更新するときのデータ
type UpdateNoteInput = {
  noteId: string;
  content: string;
};

// ノートを新規作成
export const createNote = async (input: CreateNoteInput) => {
  const h = await authHeader();
  await fetch(notesUrl(), {
    method: 'POST',
    headers: {
      ...h,
    },
    body: JSON.stringify(input),
  });
};

// ノートを更新
export const updateNote = async (input: UpdateNoteInput) => {
  const h = await authHeader();
  await fetch(noteByIdUrl(input.noteId), {
    method: 'PUT',
    headers: {
      ...h,
    },
    body: JSON.stringify({
      content: input.content,
    }),
  });
};

// UNIX時間からUTCフォーマットに文字列変換
export const toUTC = (s: string): string => (new Date(s)).toUTCString();
