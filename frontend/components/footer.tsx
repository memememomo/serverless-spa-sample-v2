import {Grid} from "@mui/material";

// フッターのコンポーネント

// フッターに表示する文字列
type FooterProps = {
  footer: string;
};

// フッターのコンポーネント
const Footer = (props: FooterProps) => {
  return (
    <Grid container spacing={5} justifyContent="center">
      <Grid item xs={12}></Grid>
      <Grid item>
        <footer>
          <div>{props.footer}</div>
        </footer>
      </Grid>
    </Grid>
  );
};

export default Footer;