import { smAndDownMediaQuery } from "@/contexts/breakpoints";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";

function Searchbar() {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      component="form"
      sx={{
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: "none",
        boxSizing: "border-box",
        ml: 2,
        display: "flex",
        alignItems: "center",
        [smAndDownMediaQuery(theme.breakpoints)]: {
          backgroundColor: "transparent",
          border: "none",
          ml: 0,
        },
      }}>
      <IconButton sx={{
        p: 1.5,
      }}>
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{
          flex: 1,
        }}
        placeholder="black trench coat..."
        inputProps={{
          "aria-label": "search products",
        }}
      />
      <Select
        defaultValue={0}
        sx={{
          width: "14%",
          maxWidth: 240,
          minWidth: 100,
        }}
        slotProps={{
          notchedOutline: {
            sx: {
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              borderRadius: 0,
              [smAndDownMediaQuery(theme.breakpoints)]: {
                backgroundColor: "transparent",
                border: "none",
              },
            },
          },
        }}>
        <MenuItem value={0}>Order by price ascending</MenuItem>
        <MenuItem value={1}>Order by price descending</MenuItem>
      </Select>
    </Paper>
  );
}

export default Searchbar;
