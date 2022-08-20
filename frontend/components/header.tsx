import {AppBar, Button, Grid, Toolbar, Typography} from "@mui/material";
import React from "react";
import useSwr from "swr";
import {Auth} from "aws-amplify";
import {useRouter} from "next/router";

// ヘッダーコンポーネント

const Header = () => {
  const router = useRouter();

  // ユーザー名を取得する
  const userName = useSwr('userName', async () => {
    const info = await Auth.currentUserInfo();
    return info?.attributes.name;
  });

  // ログアウト処理。ボタンを押下したときに実行
  const handleLogout = async () => {
    await Auth.signOut();
    return router.push('/login');
  };


  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={1} justifyContent="space-between">
            <Grid item>
              <Typography variant="h6">
                Note&nbsp;
              </Typography>
            </Grid>
            <Grid item>
              {userName.data !== '' ? userName.data : ''}
              <Button
                variant="contained"
                onClick={handleLogout}
                style={{
                  "marginLeft": "10px",
                }}
              >ログアウト</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </header>
  )
};

export default Header;