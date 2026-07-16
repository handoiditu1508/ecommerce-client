import { PasswordValidatonResult } from "@/common/rule";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Box, { BoxProps } from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export type PasswordValidatonDisplayerProps = BoxProps & {
  validationResult: PasswordValidatonResult;
};

function PasswordValidatonDisplayer({ validationResult, ...props }: PasswordValidatonDisplayerProps) {
  const theme = useTheme();

  return (
    <Box {...props}>
      <Box sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        color: validationResult.minLength ? theme.vars.palette.success.main : theme.vars.palette.error.main,
        ...theme.typography.body1,
      }}>
        {validationResult.minLength ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
        Password must at least 8 characters.
      </Box>
      <Box sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        color: validationResult.special ? theme.vars.palette.success.main : theme.vars.palette.error.main,
        ...theme.typography.body1,
      }}>
        {validationResult.special ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
        Password requires special character.
      </Box>
      <Box sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        color: validationResult.lower ? theme.vars.palette.success.main : theme.vars.palette.error.main,
        ...theme.typography.body1,
      }}>
        {validationResult.lower ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
        Password requires lowercase character.
      </Box>
      <Box sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        color: validationResult.upper ? theme.vars.palette.success.main : theme.vars.palette.error.main,
        ...theme.typography.body1,
      }}>
        {validationResult.upper ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
        Password requires uppercase character.
      </Box>
      <Box sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        color: validationResult.number ? theme.vars.palette.success.main : theme.vars.palette.error.main,
        ...theme.typography.body1,
      }}>
        {validationResult.number ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />}
        Password requires numeric character.
      </Box>
    </Box>
  );
}

export default PasswordValidatonDisplayer;
