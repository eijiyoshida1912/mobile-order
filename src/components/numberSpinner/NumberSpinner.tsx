import style from "./numberSpinner.module.scss"
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton } from "@mui/material";

type Props = {
  value: number;
  onInc: () => void;
  onDec: () => void;
};

const NumberSpinner = ({ value, onInc, onDec }: Props) => {
  return (
    <div className={style.numberSpinner}>
      <IconButton className={style.minusButton} onClick={onDec} disabled={value === 0} sx={{
        bgcolor: "transparent",
        border: "1px solid",
        borderColor: "divider",
        color: "text.secondary",
        "&:hover": { bgcolor: "action.hover" },
      }}><RemoveIcon /></IconButton>
      <Box
        sx={{
          width: 36,
          textAlign: "center",
          fontWeight: 600,
          color: "text.primary",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
          lineHeight: "36px",
          boxSizing: "border-box",
          height: "36px",
        }}
      >
        {value}
      </Box>
      <IconButton className={style.plusButton} onClick={onInc} sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": { bgcolor: "primary.dark" },
      }}><AddIcon /></IconButton>
    </div>
  )
}

export default NumberSpinner