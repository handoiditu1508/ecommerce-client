export const colorOptions = ["primary", "secondary", "error", "warning", "info", "success"] as const;

type ColorOption = typeof colorOptions[number];

export default ColorOption;
