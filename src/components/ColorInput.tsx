import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

type ColorInputProps = {
  value?: string;
  name?: string;
  label?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onValueChange: (value: string) => void;
};

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const DEFAULT_COLOR = "#000000";

function ColorInput({
  value = "",
  name,
  label,
  required,
  disabled,
  readOnly,
  fullWidth,
  error,
  helperText,
  inputRef,
  onBlur,
  onValueChange,
}: ColorInputProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const pickerColor = HEX_COLOR_PATTERN.test(value) ? value : DEFAULT_COLOR;
  const open = Boolean(anchorElement);

  return (
    <>
      <TextField
        fullWidth={fullWidth}
        name={name}
        label={label}
        required={required}
        disabled={disabled}
        value={value}
        margin="normal"
        error={error}
        helperText={helperText}
        inputRef={inputRef}
        slotProps={{
          input: {
            readOnly,
            endAdornment: (
              <InputAdornment position="end">
                {/* <Box
                  aria-hidden
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: pickerColor,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 0.5,
                  }}
                /> */}
                <SquareRoundedIcon htmlColor={pickerColor} />
              </InputAdornment>
            ),
          },
        }}
        onBlur={onBlur}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={(event) => {
          if (!disabled && !readOnly) setAnchorElement(event.currentTarget);
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorElement}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: anchorElement?.clientWidth,
              minWidth: 200,
              p: 2,
              boxSizing: "border-box",
              "& .react-colorful": { width: "100%" },
            },
          },
        }}
        onClose={() => setAnchorElement(null)}
      >
        <HexColorPicker color={pickerColor} onChange={onValueChange} />
      </Popover>
    </>
  );
}

export default ColorInput;
