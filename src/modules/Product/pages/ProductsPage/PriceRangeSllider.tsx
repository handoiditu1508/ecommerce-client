import { toVndCurrency } from "@/common/formats";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";

function PriceRangeSllider() {
  const theme = useTheme();
  const [value, setValue] = useState<number[]>([250000, 750000]);

  const handleChange = (event: Event, value: number[], activeThumb: number) => {
    setValue(value);
  };

  return (
    <Box sx={{ px: 2 }}>
      <Slider
        value={value}
        aria-label="Price range"
        min={10000}
        max={1000000}
        step={10000}
        shiftStep={10000}
        marks={[
          { value: 10000, label: "10k" },
          { value: 250000, label: "250k" },
          { value: 500000, label: "500k" },
          { value: 750000, label: "750k" },
          { value: 1000000, label: "1m" },
        ]}
        valueLabelDisplay="auto"
        valueLabelFormat={toVndCurrency}
        onChange={handleChange}
      />
      <Typography variant="body2" sx={{ mx: -1 }}>From <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(value[0])}</span> to <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(value[1])}</span></Typography>
    </Box>
  );
}

export default PriceRangeSllider;
