import { BreakpointsContext } from "@/contexts/breakpoints";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import React, { MouseEvent, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { List, RowComponentProps } from "react-window";

type Notification = {
  id: number;
  title: string;
  description: string;
  read: boolean;
};

const Transition = (props: TransitionProps & {
  children: React.ReactElement;
  ref?: React.Ref<HTMLElement>;
}) => {
  return <Grow {...props} />;
};

const INITIAL_NOTIFICATIONS: Notification[] = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  title: `Notification ${i + 1}`,
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit ${i + 1}.`,
  read: i % 3 === 0,
}));

function NotificationItem({
  index,
  style,
  notifications,
  onToggleRead,
}: RowComponentProps<{
  notifications: Notification[];
  onToggleRead: (id: number) => void;
}>) {
  const item = notifications[index];

  return (
    <ListItem
      key={item.id}
      style={style}
      component="div"
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label="toggle read" onClick={() => onToggleRead(item.id)}>
          {item.read ? <CheckCircleOutlineIcon fontSize="small" color="disabled" /> : <CheckCircleIcon fontSize="small" color="primary" />}
        </IconButton>
      }
    >
      <ListItemButton>
        <ListItemText
          primary={item.title}
          secondary={item.description}
          slotProps={{
            primary: { noWrap: true },
            secondary: { noWrap: true, variant: "caption" },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export type NotificationButtonProps = IconButtonProps;

function NotificationButton(props: NotificationButtonProps) {
  const { smAndDown, mdAndUp } = useContext(BreakpointsContext);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const { t } = useTranslation("main");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const listContent = (
    <List
      style={{
        height: smAndDown ? "calc(100vh - 64px)" : 400,
        width: smAndDown ? "100%" : 360,
      }}
      rowHeight={72}
      rowCount={notifications.length}
      rowComponent={NotificationItem}
      rowProps={{
        notifications,
        onToggleRead: handleToggleRead,
      }}
    />
  );

  return (
    <>
      <IconButton
        {...props}
        aria-describedby={id}
        onClick={handleClick}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: mdAndUp ? "right" : "left",
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {smAndDown
        ? (
          <Dialog
            fullScreen
            open={open}
            slots={{
              transition: Transition,
            }}
            onClose={handleClose}
          >
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="back" onClick={handleClose}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  {t("notifications")}
                </Typography>
              </Toolbar>
            </AppBar>
            {listContent}
          </Dialog>
        )
        : (
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            onClose={handleClose}
          >
            <Box sx={{ width: 360, bgcolor: "background.paper" }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="h6">{t("notifications")}</Typography>
              </Box>
              {listContent}
            </Box>
          </Popover>
        )}
    </>
  );
}

export default NotificationButton;
