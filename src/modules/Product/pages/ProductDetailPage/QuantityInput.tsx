import CONFIG from "@/configs";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { ChangeEventHandler, Dispatch, useEffect, useState } from "react";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "input[type=number]": {
    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
    },
  },
}));

type QuantityInputOwnProps = {
  defaultValue?: number;
  value?: number;
  onChange?: Dispatch<number>;
};

export type QuantityInputProps = Omit<InputBaseProps, keyof QuantityInputOwnProps> & QuantityInputOwnProps;

function QuantityInput({ slotProps, value: rawValue, defaultValue, onChange = CONFIG.EMPTY_FUNCTION, ...props }: QuantityInputProps) {
  const [value, setValue] = useState<number>(rawValue || defaultValue || 0);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  const handleAdd = () => {
    const newValue = value + 1;
    if (rawValue === undefined) {
      setValue(newValue);
    }
    onChange(newValue);
  };

  const handleSubtract = () => {
    const newValue = value - 1;
    if (rawValue === undefined) {
      setValue(newValue);
    }
    onChange(newValue);
  };

  useEffect(() => {
    if (rawValue !== undefined) {
      setValue(rawValue);
    }
  }, [rawValue]);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        width: "fit-content",
        backgroundColor: "transparent",
        mt: 4,
        alignSelf: "end",
      }}>
      <IconButton onClick={handleSubtract}><RemoveIcon /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mr: 1 }} />
      <StyledInputBase
        slotProps={{
          ...slotProps,
          input: {
            ...(slotProps && slotProps.input),
            type: "number",
          },
        }}
        value={value}
        onChange={handleChange}
        {...props}
      />
      <Divider orientation="vertical" flexItem sx={{ ml: 1 }} />
      <IconButton onClick={handleAdd}><AddIcon /></IconButton>
    </Paper>
  );
}

export default QuantityInput;
