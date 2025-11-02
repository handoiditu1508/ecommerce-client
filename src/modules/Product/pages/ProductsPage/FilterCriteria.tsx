import { stopBubbling } from "@/common/eventHelpers";
import { BreakpointsContext, mdAndUpMediaQuery, smAndDownMediaQuery } from "@/contexts/breakpoints";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import BrandSelector from "./BrandSelector";
import CategoryTree from "./CategoryTree";
import PriceRangeSllider from "./PriceRangeSllider";

function FilterCriteria() {
  const theme = useTheme();
  const { mdAndUp, smAndDown } = useContext(BreakpointsContext);

  return (
    <>
      {mdAndUp && <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mx: 0.5,
      }}>
        <Typography variant="h6" color="primary">Shop by</Typography>
        <ButtonBase sx={{
          ...theme.typography.caption,
          border: theme.vars.shape.smallBorder,
          px: 0.5,
          borderRadius: theme.vars.shape.borderRadius,
        }}>
          Clear All
        </ButtonBase>
      </Box>}
      <Accordion
        square
        disableGutters
        sx={{
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          "::before": {
            display: "none",
          },
          [smAndDownMediaQuery(theme.breakpoints)]: {
            backgroundColor: "transparent",
          },
        }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"

        >
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{
          px: 0,
          overflow: "auto",
          [smAndDownMediaQuery(theme.breakpoints)]: {
            maxHeight: 300,
          },
        }}>
          <CategoryTree />
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        disableGutters
        sx={{
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          "::before": {
            display: "none",
          },
          [smAndDownMediaQuery(theme.breakpoints)]: {
            backgroundColor: "transparent",
          },
        }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{
          px: 0,
          overflow: "auto",
        }}>
          <BrandSelector />
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        disableGutters
        sx={{
          border: "none",
          "::before": {
            display: "none",
          },
          [smAndDownMediaQuery(theme.breakpoints)]: {
            backgroundColor: "transparent",
          },
        }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          slotProps={{
            content: {
              sx: {
                alignItems: "center",
                gap: 0.5,
              },
            },
          }}
        >
          <Typography>Price range</Typography>
          <Checkbox size="small" sx={{ p: 0 }} onClick={stopBubbling} />
        </AccordionSummary>
        <AccordionDetails sx={{
          px: 0,
          overflow: "visible",
        }}>
          <PriceRangeSllider />
        </AccordionDetails>
      </Accordion>
      <Box sx={{ flex: 1 }} />
      <Box sx={{
        display: "flex",
        mt: 2,
        [smAndDownMediaQuery(theme.breakpoints)]: {
          justifyContent: "flex-end",
          gap: 1,
          pr: 1,
        },
      }}>
        <Button
          size="large"
          fullWidth={mdAndUp}
          startIcon={<FilterListIcon />}
          sx={{
            [mdAndUpMediaQuery(theme.breakpoints)]: {
              borderRadius: 0,
            },
          }}>
          Apply
        </Button>
        {smAndDown && <Button
          size="large"
          variant="outlined"
          endIcon={<FilterListOffIcon />}
          color="inherit">
          Clear
        </Button>}
      </Box>
    </>
  );
}

export default FilterCriteria;
