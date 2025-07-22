import { useCallback } from "react";
import { WS_EVENTS } from "./useSocket";

const useFormActions = (reset, clearErrors, emit, stopTyping) => {
    const onSubmit = useCallback((data) => {
      stopTyping();
      emit(WS_EVENTS.NEW_MESSAGE, { message: data.message });
      reset({ message: "" });
      clearErrors();
    }, [emit, reset, clearErrors, stopTyping]);
  
    const handleClearChat = useCallback(() => {
      stopTyping();
      reset({ message: "" });
      clearErrors();
    }, [reset, clearErrors, stopTyping]);
  
    return { onSubmit, handleClearChat, };
  };

  export default useFormActions;