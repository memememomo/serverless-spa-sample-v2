import {useRouter} from "next/router";
import {useEffect} from "react";

// トップページ(現状 /notes にリダイレクトしているだけ)
const Index = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/notes');
  });
  return <div></div>;
};

export default Index;
