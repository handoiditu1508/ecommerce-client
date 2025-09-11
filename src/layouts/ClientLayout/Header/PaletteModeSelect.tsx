import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { useColorScheme } from "@mui/material/styles";
import { Mode } from "node_modules/@mui/system/esm/cssVars/useCurrentColorScheme";
import TopHeaderSelect, { TopHeaderSelectItem } from "./TopHeaderSelect";

const items: TopHeaderSelectItem[] = [
  {
    title: "",
    value: "light",
    icon: <LightModeIcon fontSize="small" />,
  },
  {
    title: "",
    value: "system",
    icon: <SettingsBrightnessIcon fontSize="small" />,
  },
  {
    title: "",
    value: "dark",
    icon: <DarkModeIcon fontSize="small" />,
  },
];

function PaletteModeSelect() {
  const { mode, setMode } = useColorScheme();

  const selectedItem = items.find((item) => item.value === mode);

  const handleSelect = (item: TopHeaderSelectItem) => {
    setMode(item.value as Mode);
  };

  return (
    <TopHeaderSelect
      items={items}
      selectedItem={selectedItem}
      onSelect={handleSelect}
    />
  );
}

export default PaletteModeSelect;
