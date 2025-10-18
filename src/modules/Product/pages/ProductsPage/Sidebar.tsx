import { stopBubbling } from "@/common/eventHelpers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Checkbox from "@mui/material/Checkbox";
import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import BrandSelector from "./BrandSelector";
import CategoryTree from "./CategoryTree";
import PriceRangeSllider from "./PriceRangeSllider";

function Sidebar() {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{ width: 216 }}
      slotProps={{
        paper: {
          sx: {
            width: 216,
            boxSizing: "border-box",
            border: "none",
            mt: `calc(var(--header-client-height) + ${theme.vars.spacing} * 2)`,
            borderTop: theme.vars.shape.smallBorder,
            borderRight: theme.vars.shape.smallBorder,
            height: `calc(100% - var(--footer-height) - var(--header-client-height) - ${theme.vars.spacing} * 2)`,
            overflowX: "hidden",
          },
        },
      }}>
      <Box sx={{
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
      </Box>
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
      <Button size="large" sx={{ borderRadius: 0 }}>Apply</Button>
    </Drawer>
  );
}

export default Sidebar;
