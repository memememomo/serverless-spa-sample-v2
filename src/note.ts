
// ノートのレコード情報
export type Note = {
  userId: string;
  userName: string;
  noteId: string;
  content: string;
  createdAt: string;
};

// ノートのレコードのKey一覧
export type NoteKey = keyof Note;