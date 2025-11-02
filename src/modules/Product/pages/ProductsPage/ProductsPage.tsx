import ProductCardList from "@/components/ProductCardList";
import { BreakpointsContext, smAndDownMediaQuery } from "@/contexts/breakpoints";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import FilterCriteria from "./FilterCriteria";
import Searchbar from "./Searchbar";
import Sidebar from "./Sidebar";

function ProductsPage() {
  const theme = useTheme();
  const { mdAndUp, smAndDown } = useContext(BreakpointsContext);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  return (
    <Box sx={{
      mt: 2,
      display: "flex",
      [smAndDownMediaQuery(theme.breakpoints)]: {
        flexDirection: "column",
        mt: 0,
      },
    }}>
      {mdAndUp && <Sidebar />}
      {smAndDown && (
        <Box sx={{
          borderBottom: theme.vars.shape.smallBorder,
          pb: 2,
        }}>
          <Searchbar />
          <Divider sx={{ my: 2 }} variant="middle">
            <ButtonBase
              sx={{
                ...theme.typography.caption,
                display: "flex",
                alignItems: "center",
                px: 0.5,
                borderRadius: theme.vars.shape.borderRadius,
                color: theme.vars.palette.primary.main,
              }}
              onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}>
              Advanced search
              <ExpandMoreIcon
                fontSize="small"
                sx={{
                  transform: isAdvancedSearchOpen ? "rotateZ(180deg)" : undefined,
                  transition: theme.transitions.create("transform", {
                    duration: theme.transitions.duration.short,
                    easing: theme.transitions.easing.sharp,
                  }),
                }}
              />
            </ButtonBase>
          </Divider>
          <Collapse in={isAdvancedSearchOpen}>
            <FilterCriteria />
          </Collapse>
        </Box>
      )}
      <Box sx={{
        flex: 1,
      }}>
        {mdAndUp && <Searchbar />}
        <Box sx={{
          display: "flex",
          mt: 1,
          ml: 2,
          pr: 1,
          gap: 1,
        }}>
          <Box sx={{
            flex: 1,
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap",
          }}>
            {[...Array(10)].map((_, index) => <Chip
              key={index}
              label={`category ${index + 1}`}
              size="small"
              color="primary"
              component="a"
              href="#"
              clickable
              onDelete={(e) => e.preventDefault()}
            />)}
          </Box>
          <Typography variant="caption" color="textDisabled">99 results found</Typography>
        </Box>
        <ProductCardList quantity={12} />
      </Box>
    </Box>
  );
}

export default ProductsPage;
