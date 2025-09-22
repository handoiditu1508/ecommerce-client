import Container, { ContainerProps } from "@mui/material/Container";
import { styled } from "@mui/material/styles";

const LayoutContainer = styled(({
  maxWidth = "xl",
  disableGutters = true,
  ...props
}: ContainerProps) => (
  <Container
    maxWidth={maxWidth}
    disableGutters={disableGutters}
    {...props}
  />
))();

export default LayoutContainer;
