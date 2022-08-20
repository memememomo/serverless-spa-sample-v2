import {Typography} from "@mui/material";
import React from "react";

// エラーメッセージを表示するコンポーネント

// エラーメッセージProp
export type ErrorMessageProp = {
  message: string;
};

// エラーメッセージを表示するコンポーネント
const ErrorMessage = (props: ErrorMessageProp) => (
  <Typography style={{textAlign: 'center', color: 'red'}}>{props.message}</Typography>
);

export default ErrorMessage;