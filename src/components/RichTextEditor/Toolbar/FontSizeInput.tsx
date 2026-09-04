import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 16;

// Mirrors the Lexical playground's own non-linear stepping (larger jumps at larger sizes) rather
// than a flat +/-1px, matching `calculateNextFontSize` in its ToolbarPlugin/utils.ts.
function nextFontSize(current: number, direction: 1 | -1): number {
  if (direction === -1) {
    if (current > MAX_FONT_SIZE) return MAX_FONT_SIZE;
    if (current >= 48) return current - 12;
    if (current >= 24) return current - 4;
    if (current >= 14) return current - 2;
    if (current >= 9) return current - 1;

    return MIN_FONT_SIZE;
  }

  if (current < MIN_FONT_SIZE) return MIN_FONT_SIZE;
  if (current < 12) return current + 1;
  if (current < 20) return current + 2;
  if (current < 36) return current + 4;
  if (current <= 60) return current + 12;

  return MAX_FONT_SIZE;
}

function clamp(value: number): number {
  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, value));
}

// Editable font-size stepper (playground has no dropdown here - a numeric input plus +/- buttons),
// an empty value means "no explicit size" (falls back to the Default option's inherited size).
function FontSizeInput({ value, onChange }: { value: string | null; onChange: (value: string) => void; }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value ? value.replace("px", "") : "");

  useEffect(() => setInputValue(value ? value.replace("px", "") : ""), [value]);

  const commit = (raw: string) => {
    if (raw === "") {
      onChange("");

      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      setInputValue(value ? value.replace("px", "") : "");

      return;
    }
    const clamped = clamp(parsed);
    setInputValue(String(clamped));
    onChange(`${clamped}px`);
  };

  const step = (direction: 1 | -1) => {
    const current = inputValue ? Number(inputValue) : DEFAULT_FONT_SIZE;
    const next = nextFontSize(current, direction);
    setInputValue(String(next));
    onChange(`${next}px`);
  };

  return (
    <TextField
      size="small"
      variant="standard"
      type="text"
      value={inputValue}
      placeholder={t("font_default")}
      sx={{ width: 130 }}
      slotProps={{
        // The bare <input> has no intrinsic width of its own (empty value, no `size` attribute) -
        // without one, it collapses to a sliver next to the start/end adornments instead of
        // reserving enough room for the "Default" placeholder text or a couple of digits.
        htmlInput: { inputMode: "numeric", sx: { textAlign: "center", width: 50 } },
        input: {
          startAdornment: (
            <Tooltip title={t("decrease_font_size")}>
              <IconButton size="small" disabled={inputValue !== "" && Number(inputValue) <= MIN_FONT_SIZE} onClick={() => step(-1)}>
                <RemoveIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          ),
          endAdornment: (
            <>
              <InputAdornment position="end" sx={{ mr: 0 }}>px</InputAdornment>
              <Tooltip title={t("increase_font_size")}>
                <IconButton size="small" disabled={inputValue !== "" && Number(inputValue) >= MAX_FONT_SIZE} onClick={() => step(1)}>
                  <AddIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </>
          ),
        },
      }}
      onChange={(event) => {
        const digitsOnly = event.target.value.replace(/[^0-9]/g, "");
        setInputValue(digitsOnly);
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter") {
          event.preventDefault();
          commit(inputValue);
          event.currentTarget.blur();
        }
      }}
      onBlur={() => commit(inputValue)}
    />
  );
}

export default FontSizeInput;
