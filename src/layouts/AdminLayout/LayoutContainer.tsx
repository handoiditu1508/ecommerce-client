import { mdAndUpMediaQuery } from "@/contexts/breakpoints";
import Container, { ContainerProps } from "@mui/material/Container";
import { styled } from "@mui/material/styles";

const LayoutContainer = styled(({
  disableGutters = true,
  maxWidth = false,
  ...props
}: ContainerProps) => (
  <Container
    disableGutters={disableGutters}
    maxWidth={maxWidth}
    {...props}
  />
))(({ theme }) => ({
  [mdAndUpMediaQuery(theme.breakpoints)]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

export default LayoutContainer;
