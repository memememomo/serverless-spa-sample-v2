import ErrorMessage, {ErrorMessageProp} from "./error-message";
import Layout from "./layout";

// エラーメッセージのみを表示する画面のコンポーネント

// 現状は、エラーメッセージのみを受け取るPropなので、ErrorMessagePropを継承
export type ErrorMessagePageProp = ErrorMessageProp;

// エラーメッセージのみを表示する画面のコンポーネント
const ErrorMessagePage = (props: ErrorMessagePageProp) => {
  return (
    <Layout title="エラー">
      <ErrorMessage message={props.message}/>
    </Layout>
  )
};

export default ErrorMessagePage;