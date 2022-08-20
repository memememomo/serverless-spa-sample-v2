

// エラーが起こった場合、SetStateでエラーメッセーを設定する
export const handleError = (err: any, setter: (s: string) => void) => {
  if (err instanceof Error) {
    setter(err.toString());
  }
};