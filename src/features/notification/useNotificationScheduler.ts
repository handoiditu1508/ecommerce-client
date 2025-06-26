import CONFIG from "@/configs";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { nextNotification, selectNotifications, selectShouldSetTimeout, setShouldSetTimeout, setTimeoutId } from "@/redux/slices/notificationSlice";
import { useEffect } from "react";

/**
 * Hook to schedule notification messages to appear and disappear.
 */
export default function useNotificationScheduler() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const shouldSetTimeout = useAppSelector(selectShouldSetTimeout);

  // remove oldest notification after timeout
  useEffect(() => {
    if (notifications.length !== 0 && shouldSetTimeout) {
      const timeout = setTimeout(() => {
        dispatch(nextNotification());
      }, CONFIG.NOTIFICATION_MESSAGE_TIMEOUT);
      dispatch(setTimeoutId(timeout as unknown as number));
      dispatch(setShouldSetTimeout(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, shouldSetTimeout]);
}
