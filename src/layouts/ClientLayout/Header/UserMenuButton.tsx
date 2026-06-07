import LetterAvatar from "@/components/LetterAvatar";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { authSelectors, clearAuthState } from "@/redux/slices/authSlice";
import HistoryIcon from "@mui/icons-material/History";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export type UserMenuButtonProps = IconButtonProps;

function UserMenuButton(props: UserMenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(authSelectors.signedIn);
  const authUser = useAppSelector(authSelectors.user);
  const { t: tMain } = useTranslation("main");

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(clearAuthState());
    handleClose();
  };

  return (
    <>
      <IconButton
        {...props}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
      >
        {authUser
          ? (
            <LetterAvatar sx={{
              width: 24,
              height: 24,
            }}>
              {`${authUser.firstName} ${authUser.lastName}`}
            </LetterAvatar>
          )
          : <PersonIcon />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { mt: 1.5, minWidth: 180 },
          },
        }}
        onClose={handleClose}
      >
        {isLoggedIn
          ? (
            [
              <MenuItem key="settings" component={Link} to="/account" onClick={handleClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{tMain("setting")}</ListItemText>
              </MenuItem>,
              <MenuItem key="history" component={Link} to="/" onClick={handleClose}>
                <ListItemIcon>
                  <HistoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{tMain("order_history")}</ListItemText>
              </MenuItem>,
              <MenuItem key="logout" onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{tMain("logout")}</ListItemText>
              </MenuItem>,
            ]
          )
          : (
            [
              <MenuItem key="login" component={Link} to="/login" onClick={handleClose}>
                <ListItemIcon>
                  <LoginIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{tMain("login")}</ListItemText>
              </MenuItem>,
              <MenuItem key="register" component={Link} to="/register" onClick={handleClose}>
                <ListItemIcon>
                  <PersonAddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{tMain("register")}</ListItemText>
              </MenuItem>,
            ]
          )}
      </Menu>
    </>
  );
}

export default UserMenuButton;
