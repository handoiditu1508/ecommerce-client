import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import React from "react";
import ErrorBoundary from "./ErrorBoundary";

type OwnProps = {
  fallbackType?: "inline" | "backdrop";
  errorCallback?: () => void;
};

type SuspenseProps = OwnProps & Omit<React.SuspenseProps, keyof OwnProps>;

export default function Suspense({ fallbackType = "inline", errorCallback, ...props }: SuspenseProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ErrorBoundary hideError={fallbackType === "backdrop"} errorCallback={errorCallback}>
      <React.Suspense
        fallback={
          <>
            {fallbackType === "inline" && <Box sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}>
              <CircularProgress />
            </Box>}
            {fallbackType === "backdrop" && <Backdrop
              open={open}
              sx={{ zIndex: theme.vars.zIndex.drawer + 1 }}
              onClick={handleClose}>
              <CircularProgress />
            </Backdrop>}
          </>
        }
        {...props}
      />
    </ErrorBoundary>
  );
}
