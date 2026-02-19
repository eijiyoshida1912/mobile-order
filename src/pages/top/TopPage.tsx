import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import style from "./top.module.scss"

export default function TopPage() {
  return (
    <div className={style.topPage}>
      <div className={style.textWrap}>
        <h1>Just a Bar</h1>
        <p>おしゃれなバーへようこそ<br />
          ご注文はごゆっくりどうぞ</p>

        <Button
          className={style.button}
          component={Link}
          to="/menu"
          variant="contained"
          size="large"
        >注文を始める</Button>
      </div>
    </div>
  );
}