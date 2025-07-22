import { useEffect } from "react";
import { WS_EVENTS } from "./useSocket";

const useUserStatus = (user, emit) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const status = document.hidden ? 'offline' : 'online';
      emit(WS_EVENTS.UPDATE_STATUS, { ...user, status });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, emit]);
};

export default useUserStatus;
