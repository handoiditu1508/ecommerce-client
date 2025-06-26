import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Box } from "@mui/material";
import React, { Component } from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  hideError?: boolean;
  errorCallback?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    this.props.errorCallback && this.props.errorCallback();

    if (!this.props.hideError) {
      // You can render any custom fallback UI
      return (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
          <ReportProblemIcon fontSize="large" />
        </Box>
      );
    }

    return undefined;
  }
}
