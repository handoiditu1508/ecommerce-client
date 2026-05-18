import { toVndCurrency } from "@/common/formats";
import Box from "@mui/material/Box";
import Slider, { SliderProps } from "@mui/material/Slider";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ActionDispatch } from "react";
import { ProductsReducerAction, ProductsReducerState } from "./useProductsReducer";

export type PriceRangeSlliderProps = {
  productsState: ProductsReducerState;
  productsDispatch: ActionDispatch<[ProductsReducerAction]>;
};

const MIN_SLIDER_VALUE = 10000;
const MAX_SLIDER_VALUE = 1000000;
const marks: SliderProps["marks"] = [
  { value: MIN_SLIDER_VALUE, label: "10k" },
  { value: 250000, label: "250k" },
  { value: 500000, label: "500k" },
  { value: 750000, label: "750k" },
  { value: MAX_SLIDER_VALUE, label: "1m" },
];

function PriceRangeSllider({
  productsState,
  productsDispatch,
}: PriceRangeSlliderProps) {
  const theme = useTheme();
  // const [value, setValue] = useState<number[]>([250000, 750000]);
  const value: [number, number] = [
    productsState.query.minPrice ?? MIN_SLIDER_VALUE,
    productsState.query.maxPrice ?? MAX_SLIDER_VALUE,
  ];

  const handleChange = (event: Event, value: number[], activeThumb: number) => {
    productsDispatch({
      type: "SET_PRICE_RANGE",
      payload: value as [number, number],
    });
  };

  return (
    <Box sx={{ px: 2 }}>
      <Slider
        value={value}
        aria-label="Price range"
        min={MIN_SLIDER_VALUE}
        max={MAX_SLIDER_VALUE}
        step={10000}
        shiftStep={10000}
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={toVndCurrency}
        onChange={handleChange}
      />
      <Typography variant="body2" sx={{ mx: -1 }}>From <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(value[0])}</span> to <span style={{ color: theme.vars.palette.primary.main }}>{toVndCurrency(value[1])}</span></Typography>
    </Box>
  );
}

export default PriceRangeSllider;
