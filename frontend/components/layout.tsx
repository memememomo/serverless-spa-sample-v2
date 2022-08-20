import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import React from "react";

// 全ページで共通で使用するレイアウトコンポーネント

// レイアウトコンポーネントで渡されるProp
type LayoutProps = {
  children?: React.ReactNode;
  title: string;
};

// レイアウトコンポーネント
const Layout = (props: LayoutProps) => {
  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <meta charSet='utf-8'/>
        <meta name="description" content="ノートアプリ"/>
        <meta name="viewport" content="initial-scale=!.0, width=device-width"/>
      </Head>
      <Header/>
      {props.children}
      <Footer footer="copyright uchiko"/>
    </div>
  )
};

export default Layout;