import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";

function Searchbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (searchText.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchText.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <Box
      component="form"
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: theme.alpha(theme.palette.common.white, 0.15),
        "&:hover": {
          backgroundColor: theme.alpha(theme.palette.common.white, 0.25),
        },
      }}
      onSubmit={handleSearchSubmit}
    >
      <InputBase
        fullWidth
        placeholder="Search..."
        size="small"
        value={searchText}
        sx={{
          color: "inherit",
        }}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{
              color: "inherit",
            }}>
            <IconButton
              type="submit"
              aria-label="search"
              edge="end"
              sx={{
                color: "inherit",
              }}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        onChange={handleSearchChange}
      />
    </Box>
  );
}

export default Searchbar;
